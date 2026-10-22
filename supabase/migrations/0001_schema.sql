-- ============================================================
-- BuildWithMe — schema, RLS policies, storage bucket
-- Run this FIRST in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ---------- Tables ----------
create table if not exists public.site_settings (
  id int primary key default 1,
  hero_title text not null default 'Turn Your Ideas Into Real Products',
  hero_subtitle text not null default 'Websites, apps, UI/UX and AI solutions.',
  hero_badge text not null default 'Available for projects',
  tagline text not null default 'Webs • Apps • And More',
  subline text not null default 'Ideas → Code → Reality',
  about_title text not null default 'About BuildWithMe',
  about_text text not null default '',
  instagram text not null default 'buildwithme',
  whatsapp text not null default '',
  email text not null default 'hello@buildwithme.dev',
  seo_title text not null default 'BuildWithMe — Webs • Apps • And More',
  seo_description text not null default 'Freelance developer building websites, apps, UI/UX and AI solutions.',
  og_image text,
  available_for_work boolean not null default true
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null default '',
  category text not null default 'Other' check (category in ('Website','App','UI/UX','AI','E-commerce','Other')),
  year int not null default 2025,
  client_name text,
  role text,
  overview text,
  problem text,
  solution text,
  key_features text[] not null default '{}',
  tech_stack text[] not null default '{}',
  live_url text,
  github_url text,
  results text,
  cover_url text,
  video_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists projects_published_idx on public.projects (published, featured desc, sort_order);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);
create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

create table if not exists public.tech_stack (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  icon text,
  description text,
  visible boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.project_tech (
  project_id uuid not null references public.projects(id) on delete cascade,
  tech_id uuid not null references public.tech_stack(id) on delete cascade,
  primary key (project_id, tech_id)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  features text[] not null default '{}',
  price text not null default 'Custom quote',
  icon text not null default 'Sparkles',
  visible boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  avatar_url text,
  visible boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  visible boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value int not null default 0,
  suffix text,
  visible boolean not null default true,
  sort_order int not null default 0
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  project_type text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','replied','closed')),
  created_at timestamptz not null default now()
);
create index if not exists inquiries_created_idx on public.inquiries (created_at desc);

-- Admin allow-list. Row inserted by scripts/create-admin.mjs
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

-- ---------- Helper: is the caller the owner/admin? ----------
create or replace function public.is_admin()
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- ---------- RLS ----------
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.tech_stack enable row level security;
alter table public.project_tech enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.stats enable row level security;
alter table public.inquiries enable row level security;
alter table public.admins enable row level security;

-- settings: public read
create policy "settings public read" on public.site_settings
  for select using (true);
create policy "settings admin write" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());
create policy "settings admin insert" on public.site_settings
  for insert with check (public.is_admin());

-- projects: public reads published, admin full
create policy "projects public read" on public.projects
  for select using (published = true or public.is_admin());
create policy "projects admin insert" on public.projects
  for insert with check (public.is_admin());
create policy "projects admin update" on public.projects
  for update using (public.is_admin()) with check (public.is_admin());
create policy "projects admin delete" on public.projects
  for delete using (public.is_admin());

-- project_images: public read, admin write
create policy "images public read" on public.project_images
  for select using (true);
create policy "images admin write" on public.project_images
  for insert with check (public.is_admin());
create policy "images admin update" on public.project_images
  for update using (public.is_admin());
create policy "images admin delete" on public.project_images
  for delete using (public.is_admin());

-- tech_stack: public reads visible, admin full
create policy "tech public read" on public.tech_stack
  for select using (visible = true or public.is_admin());
create policy "tech admin insert" on public.tech_stack
  for insert with check (public.is_admin());
create policy "tech admin update" on public.tech_stack
  for update using (public.is_admin()) with check (public.is_admin());
create policy "tech admin delete" on public.tech_stack
  for delete using (public.is_admin());

create policy "project_tech public read" on public.project_tech
  for select using (true);
create policy "project_tech admin write" on public.project_tech
  for insert with check (public.is_admin());
create policy "project_tech admin delete" on public.project_tech
  for delete using (public.is_admin());

-- services / testimonials / faqs / stats: public reads visible, admin full
create policy "services public read" on public.services
  for select using (visible = true or public.is_admin());
create policy "services admin write" on public.services
  for insert with check (public.is_admin());
create policy "services admin update" on public.services
  for update using (public.is_admin()) with check (public.is_admin());
create policy "services admin delete" on public.services
  for delete using (public.is_admin());

create policy "testimonials public read" on public.testimonials
  for select using (visible = true or public.is_admin());
create policy "testimonials admin write" on public.testimonials
  for insert with check (public.is_admin());
create policy "testimonials admin update" on public.testimonials
  for update using (public.is_admin()) with check (public.is_admin());
create policy "testimonials admin delete" on public.testimonials
  for delete using (public.is_admin());

create policy "faqs public read" on public.faqs
  for select using (visible = true or public.is_admin());
create policy "faqs admin write" on public.faqs
  for insert with check (public.is_admin());
create policy "faqs admin update" on public.faqs
  for update using (public.is_admin()) with check (public.is_admin());
create policy "faqs admin delete" on public.faqs
  for delete using (public.is_admin());

create policy "stats public read" on public.stats
  for select using (visible = true or public.is_admin());
create policy "stats admin write" on public.stats
  for insert with check (public.is_admin());
create policy "stats admin update" on public.stats
  for update using (public.is_admin()) with check (public.is_admin());
create policy "stats admin delete" on public.stats
  for delete using (public.is_admin());

-- inquiries: anyone (anon) can INSERT with length checks, nobody but admin can read
create policy "inquiries anon insert" on public.inquiries
  for insert to anon, authenticated
  with check (
    char_length(name) between 2 and 120
    and char_length(contact) between 5 and 160
    and char_length(project_type) between 2 and 80
    and char_length(message) between 10 and 2000
  );
create policy "inquiries admin read" on public.inquiries
  for select using (public.is_admin());
create policy "inquiries admin update" on public.inquiries
  for update using (public.is_admin()) with check (public.is_admin());
create policy "inquiries admin delete" on public.inquiries
  for delete using (public.is_admin());

-- admins: a signed-in admin can see only their own row (used by middleware check)
create policy "admins self read" on public.admins
  for select using (auth.uid() = id);
create policy "admins service insert" on public.admins
  for insert with check (public.is_admin());

-- ---------- Storage: portfolio-media bucket ----------
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects
  for select using (bucket_id = 'portfolio-media');
create policy "media admin insert" on storage.objects
  for insert with check (bucket_id = 'portfolio-media' and public.is_admin());
create policy "media admin update" on storage.objects
  for update using (bucket_id = 'portfolio-media' and public.is_admin())
  with check (bucket_id = 'portfolio-media' and public.is_admin());
create policy "media admin delete" on storage.objects
  for delete using (bucket_id = 'portfolio-media' and public.is_admin());
