'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';

export async function deleteMedia(paths: string[]) {
  await requireAdmin();
  const supabase = createClient();
  const { error } = await supabase.storage.from('portfolio-media').remove(paths);
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
  return { ok: true as const };
}
