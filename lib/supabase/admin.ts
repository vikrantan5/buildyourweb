import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/** Server-only client with elevated privileges. Use sparingly (admin scripts). */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
