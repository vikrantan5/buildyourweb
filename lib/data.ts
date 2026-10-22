import type { Faq, Project, Service, SiteSettings, Stat, TechStackItem, Testimonial } from '@/types/database';
import {
  DEFAULT_SETTINGS, SAMPLE_FAQS, SAMPLE_PROJECTS, SAMPLE_SERVICES, SAMPLE_STATS, SAMPLE_TECH, SAMPLE_TESTIMONIALS,
} from '@/lib/sample-data';
import { createClient } from '@/lib/supabase/server';

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (error || !data) return DEFAULT_SETTINGS;
    return data as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const supabase = createClient();
    let q = supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('sort_order', { ascending: true });
    q = q.eq('published', true);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data as Project[]) ?? [];
  } catch {
    return SAMPLE_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = createClient();
    const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).eq('published', true).maybeSingle();
    if (error || !project) return SAMPLE_PROJECTS.find((p) => p.slug === slug) ?? null;
    const { data: images } = await supabase.from('project_images').select('*').eq('project_id', project.id).order('sort_order');
    return { ...(project as Project), images: (images ?? []) as Project['images'] };
  } catch {
    return SAMPLE_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getProjectNeighbors(slug: string) {
  const all = await getProjects();
  const i = all.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? all[i - 1] : all[all.length - 1] ?? null,
    next: i >= 0 && i < all.length - 1 ? all[i + 1] : all[0] ?? null,
  };
}

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('services').select('*').eq('visible', true).order('sort_order');
    if (error || !data || !data.length) return SAMPLE_SERVICES;
    return data as Service[];
  } catch {
    return SAMPLE_SERVICES;
  }
}

export async function getTechStack(): Promise<TechStackItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('tech_stack').select('*').eq('visible', true).order('sort_order');
    if (error || !data || !data.length) return SAMPLE_TECH;
    return data as TechStackItem[];
  } catch {
    return SAMPLE_TECH;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('testimonials').select('*').eq('visible', true).order('sort_order');
    if (error || !data || !data.length) return SAMPLE_TESTIMONIALS;
    return data as Testimonial[];
  } catch {
    return SAMPLE_TESTIMONIALS;
  }
}

export async function getFaqs(): Promise<Faq[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('faqs').select('*').eq('visible', true).order('sort_order');
    if (error || !data || !data.length) return SAMPLE_FAQS;
    return data as Faq[];
  } catch {
    return SAMPLE_FAQS;
  }
}

export async function getStats(): Promise<Stat[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('stats').select('*').eq('visible', true).order('sort_order');
    if (error || !data || !data.length) return SAMPLE_STATS;
    return data as Stat[];
  } catch {
    return SAMPLE_STATS;
  }
}
