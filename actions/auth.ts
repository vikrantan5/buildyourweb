'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin-auth';

export async function signInAction(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return { ok: false as const, error: 'Invalid email or password.' };
  const { user, admin } = await isAdmin();
  if (!user || !admin) {
    await supabase.auth.signOut();
    return { ok: false as const, error: 'This account is not authorized as the admin.' };
  }
  return { ok: true as const };
}

export async function signOutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
