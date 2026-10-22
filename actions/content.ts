'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { settingsSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

const CONTENT_TABLES = ['services', 'tech_stack', 'testimonials', 'faqs', 'stats'] as const;
type ContentTable = (typeof CONTENT_TABLES)[number];

function isContentTable(t: string): t is ContentTable {
  return (CONTENT_TABLES as readonly string[]).includes(t);
}

const recordSchema = z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()]));

export async function upsertRecord(table: string, values: Record<string, unknown>) {
  await requireAdmin();
  if (!isContentTable(table)) throw new Error('Unknown table');
  const parsed = recordSchema.safeParse(values);
  if (!parsed.success) throw new Error('Invalid data');
  const supabase = createClient();
  const { error } = await supabase.from(table).upsert(values);
  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { ok: true as const };
}

export async function deleteRecord(table: string, id: string) {
  await requireAdmin();
  if (!isContentTable(table)) throw new Error('Unknown table');
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { ok: true as const };
}

export async function toggleVisible(table: string, id: string, visible: boolean) {
  await requireAdmin();
  if (!isContentTable(table)) throw new Error('Unknown table');
  const supabase = createClient();
  const { error } = await supabase.from(table).update({ visible }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/', 'layout');
  return { ok: true as const };
}

export async function reorderRecords(table: string, orderedIds: string[]) {
  await requireAdmin();
  if (!isContentTable(table)) throw new Error('Unknown table');
  const supabase = createClient();
  await Promise.all(orderedIds.map((id, i) => supabase.from(table).update({ sort_order: i + 1 }).eq('id', id)));
  revalidatePath('/', 'layout');
  return { ok: true as const };
}

export async function updateSettings(values: unknown) {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(values);
  if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  const supabase = createClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, ...parsed.data, og_image: parsed.data.og_image || null });
  if (error) return { ok: false as const, error: error.message };
  revalidatePath('/', 'layout');
  return { ok: true as const };
}
