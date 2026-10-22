'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { inquirySchema, type InquiryFormValues } from '@/lib/validators';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin-auth';

// Basic in-memory rate limit: 5 submissions / 10 min / IP (per server instance)
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const window = 10 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < window);
  if (recent.length >= 5) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function submitInquiry(values: InquiryFormValues) {
  const parsed = inquirySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? 'Invalid submission' };
  }
  const { website, ...data } = parsed.data;
  if (website) return { ok: true as const }; // honeypot filled — pretend success

  const h = headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return { ok: false as const, error: 'Too many messages from your network. Please try again later.' };
  }

  const supabase = createClient();
  const { error } = await supabase.from('inquiries').insert({ ...data, status: 'new' });
  if (error) return { ok: false as const, error: 'Could not send right now — message me on Instagram or WhatsApp instead.' };
  revalidatePath('/admin', 'layout');
  return { ok: true as const };
}

const STATUS = ['new', 'replied', 'closed'] as const;

export async function setInquiryStatus(id: string, status: string) {
  await requireAdmin();
  if (!(STATUS as readonly string[]).includes(status)) throw new Error('Invalid status');
  const supabase = createClient();
  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
  return { ok: true as const };
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.from('inquiries').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
  return { ok: true as const };
}

export async function exportInquiriesCsv() {
  await requireAdmin();
  const supabase = createClient();
  const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5000);
  const rows = [
    ['date', 'name', 'contact', 'project_type', 'message', 'status'],
    ...((data ?? []) as Record<string, string>[]).map((r) => [
      r.created_at, r.name, r.contact, r.project_type, r.message.replace(/\n/g, ' '), r.status,
    ]),
  ];
  return rows.map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
}
