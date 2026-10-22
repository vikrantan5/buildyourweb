#!/usr/bin/env node
/**
 * Creates (or resets) the admin user + grants admin access.
 * Usage:  npm run create-admin  <email> <password>
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

function loadEnv() {
  try {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}

loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2] || process.env.ADMIN_EMAIL;
const password = process.argv[3];

if (!url || !serviceKey) {
  console.error('✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <admin-email> <admin-password>');
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

const { data: listData, error: listErr } = await admin.auth.admin.listUsers();
if (listErr) {
  console.error('✗ Could not query users. Is this the right Supabase project?', listErr.message);
  process.exit(1);
}
let user = listData.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

if (user) {
  const { error } = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  if (error) { console.error('✗ Could not reset password:', error.message); process.exit(1); }
  console.log(`✓ Existing user updated: ${email} (password set, email confirmed)`);
} else {
  const { data: created, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
  });
  if (error) { console.error('✗ Could not create user:', error.message); process.exit(1); }
  user = created.user;
  console.log(`✓ Admin user created: ${email}`);
}

const { error: adminsErr } = await admin.from('admins').upsert({ id: user.id, email });
if (adminsErr) {
  console.error(`✗ User created, but granting admin failed: ${adminsErr.message}`);
  console.error('  Did you run supabase/migrations/0001_schema.sql first? Or run this SQL in the dashboard:');
  console.error(`  insert into admins (id, email) values ('${user.id}', '${email}');`);
  process.exit(1);
}
console.log('✓ Admin access granted (admins table)');
console.log('\nYou can now sign in at /admin/login with that email and password.');
