'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';
import { projectSchema } from '@/lib/validators';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

function revalidateAll() {
  revalidatePath('/', 'layout');
}

export async function upsertProject(values: unknown) {
  await requireAdmin();
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }
  const supabase = createClient();
  const { id, ...rest } = parsed.data as typeof parsed.data & { id?: string };
  const payload = {
    ...rest,
    client_name: rest.client_name || null,
    role: rest.role || null,
    overview: rest.overview || null,
    problem: rest.problem || null,
    solution: rest.solution || null,
    results: rest.results || null,
    cover_url: rest.cover_url || null,
    video_url: rest.video_url || null,
    live_url: rest.live_url || null,
    github_url: rest.github_url || null,
  };
  let projectId = id;
  if (projectId) {
    const { error } = await supabase.from('projects').update(payload).eq('id', projectId);
    if (error) return { ok: false as const, error: error.message };
  } else {
    const maxRow = await supabase.from('projects').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...payload, sort_order: (maxRow.data?.sort_order ?? 0) + 1 })
      .select('id')
      .single();
    if (error) return { ok: false as const, error: error.message };
    projectId = (data as { id: string }).id;
  }
  await syncProjectTech(supabase, projectId!, payload.tech_stack);
  revalidateAll();
  return { ok: true as const, id: projectId };
}

export async function setProjectImages(projectId: string, urls: string[]) {
  await requireAdmin();
  const supabase = createClient();
  await supabase.from('project_images').delete().eq('project_id', projectId);
  if (urls.length) {
    await supabase.from('project_images').insert(urls.map((url, i) => ({ project_id: projectId, url, sort_order: i })));
  }
  revalidateAll();
  return { ok: true as const };
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidateAll();
  return { ok: true as const };
}

export async function duplicateProject(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { data: source } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (!source) return { ok: false as const, error: 'Project not found' };
  const { id: _omit, created_at: _omit2, ...rest } = source;
  const maxRow = await supabase.from('projects').select('sort_order').order('sort_order', { ascending: false }).limit(1).maybeSingle();
  const { data: copy, error } = await supabase
    .from('projects')
    .insert({ ...rest, title: `${source.title} (Copy)`, slug: `${source.slug}-copy-${Date.now().toString(36)}`, published: false, sort_order: (maxRow.data?.sort_order ?? 0) + 1 })
    .select('id')
    .single();
  if (error) return { ok: false as const, error: error.message };
  const { data: imgs } = await supabase.from('project_images').select('*').eq('project_id', id);
  if (imgs?.length) {
    await supabase.from('project_images').insert(imgs.map(({ id: _i, project_id: _p, ...img }) => ({ ...img, project_id: (copy as { id: string }).id })));
  }
  revalidateAll();
  return { ok: true as const };
}

export async function setProjectFlags(id: string, flags: { featured?: boolean; published?: boolean }) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('projects').update(flags).eq('id', id);
  if (error) return { ok: false as const, error: error.message };
  revalidateAll();
  return { ok: true as const };
}

export async function bulkSetPublished(ids: string[], published: boolean) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('projects').update({ published }).in('id', ids);
  if (error) return { ok: false as const, error: error.message };
  revalidateAll();
  return { ok: true as const };
}

export async function reorderProjects(orderedIds: string[]) {
  await requireAdmin();
  const supabase = createClient();
  await Promise.all(orderedIds.map((id, i) => supabase.from('projects').update({ sort_order: i + 1 }).eq('id', id)));
  revalidateAll();
  return { ok: true as const };
}

/** Keep the project_tech join table in sync with the tech names on the project. */
async function syncProjectTech(supabase: Awaited<ReturnType<typeof createClient>>, projectId: string, techNames: string[]) {
  if (!techNames.length) {
    await supabase.from('project_tech').delete().eq('project_id', projectId);
    return;
  }
  const { data: existing } = await supabase.from('tech_stack').select('id, name');
  const nameToId = new Map((existing ?? []).map((t) => [(t as { name: string }).name.toLowerCase(), (t as { id: string }).id]));
  const missing = techNames.filter((n) => !nameToId.has(n.toLowerCase()));
  if (missing.length) {
    const { data: created } = await supabase
      .from('tech_stack')
      .insert(missing.map((name, i) => ({ name, sort_order: 100 + i })))
      .select('id, name');
    (created ?? []).forEach((t) => nameToId.set((t as { name: string }).name.toLowerCase(), (t as { id: string }).id));
  }
  const rows = techNames
    .map((n) => ({ project_id: projectId, tech_id: nameToId.get(n.toLowerCase())! }))
    .filter((r) => r.tech_id);
  await supabase.from('project_tech').delete().eq('project_id', projectId);
  if (rows.length) await supabase.from('project_tech').insert(rows);
}

