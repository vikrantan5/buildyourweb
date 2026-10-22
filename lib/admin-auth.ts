import { createClient } from '@/lib/supabase/server';

/**
 * Verifies the current session belongs to the owner.
 * Admin = email matches ADMIN_EMAIL env, or a row exists in the `admins` table.
 */
export async function isAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, admin: false as const };
  if (
    process.env.ADMIN_EMAIL &&
    user.email &&
    user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
  ) {
    return { user, admin: true as const };
  }
  const { data } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle();
  return { user, admin: ( !!data) as boolean };
}

export async function requireAdmin() {
  const { user, admin } = await isAdmin();
  if (!user || !admin) throw new Error('Unauthorized');
  return user;
}
