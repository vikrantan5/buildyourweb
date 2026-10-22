-- ============================================================
-- BuildWithMe — seed data
-- Run this SECOND (after 0001_schema.sql) in the SQL Editor.
-- ⚠️ SAMPLE CONTENT: everything below is sample content you can
--    safely delete later from the admin panel.
-- ============================================================

-- Settings (single row, id = 1)
insert into public.site_settings (id, hero_title, hero_subtitle, hero_badge, tagline, subline, about_title, about_text, instagram, whatsapp, email, seo_title, seo_description, available_for_work)
values (
  1,
  'Turn Your Ideas Into Real Products',
  'I design and build websites, mobile apps, UI/UX and AI solutions that ship fast, look stunning and perform even better.',
  'Available for projects',
  'Webs • Apps • And More',
  'Ideas → Code → Reality',
  'About BuildWithMe',
  'I am a freelance developer who turns rough ideas into polished, production-grade products — websites, mobile apps, thoughtful UI/UX and AI-powered tools. One person, end-to-end: strategy, design, code, launch and support. No agencies, no hand-offs, no lost-in-translation. You talk directly to the person building your product.',
  'buildwithme',
  '919999999999',
  'hello@buildwithme.dev',
  'BuildWithMe — Webs • Apps • And More',
  'Freelance developer building websites, mobile apps, UI/UX and AI solutions. Ideas → Code → Reality.',
  true
) on conflict (id) do nothing;

-- Tech stack (powers the orbit + project tags)
insert into public.tech_stack (name, sort_order) values
  ('React', 1), ('Next.js', 2), ('Node.js', 3), ('Express', 4), ('MongoDB', 5),
  ('PostgreSQL', 6), ('Firebase', 7), ('Tailwind CSS', 8), ('AWS / Vercel', 9),
  ('Supabase', 10), ('AI / LLM Tools', 11)
on conflict (name) do nothing;

-- Services
insert into public.services (title, description, features, price, icon, sort_order) values
  ('Website Development',
   'Marketing sites, business websites and e-commerce stores built to load fast, rank well and convert visitors.',
   array['Custom design (no templates)','SEO + performance setup','Admin panel to edit content','E-commerce from ₹7,000–₹10,000'],
   '₹7,000 – ₹10,000', 'Globe', 1),
  ('App Development',
   'Android + iOS apps from one codebase — idea to Play Store and App Store, with post-launch support.',
   array['Android + iOS from one codebase','Auth, payments, notifications','Store listing + launch help','30 days free bug support'],
   '₹15,000', 'Smartphone', 2),
  ('UI/UX Design',
   'Interfaces users understand in seconds — wireframes, design systems and pixel-perfect handoff.',
   array['User flows + wireframes','High-fidelity designs','Interactive prototype','Developer-ready handoff'],
   '₹4,000 onwards', 'PenTool', 3),
  ('AI & More',
   'Chatbots, automation and AI features woven into your product — grounded in your own data.',
   array['Chatbots trained on your docs','Workflow automation','AI features in existing apps','Integrations & APIs'],
   'Custom quote', 'Sparkles', 4);

-- Stats
insert into public.stats (label, value, suffix, sort_order) values
  ('Projects completed', 20, '+', 1),
  ('Technologies mastered', 15, '+', 2),
  ('Happy clients', 12, '+', 3),
  ('On-time delivery', 100, '%', 4);

-- FAQs
insert into public.faqs (question, answer, sort_order) values
  ('How much does a website cost?', 'E-commerce and business websites start at ₹7,000–₹10,000 depending on pages and features. You get a fixed quote after one short call — no hourly surprises.', 1),
  ('How long does a mobile app take?', 'A typical Android + iOS app ships in 3–6 weeks depending on scope. You get a working preview from week one, not a big reveal at the end.', 2),
  ('Do you work with clients outside India?', 'Yes. Projects run over video calls and everything — designs, demos, invoices — is shared async so time zones never slow us down.', 3),
  ('What if I need changes after launch?', 'Every project includes 30 days of free bug support. After that, small edits are quick and cheap — or I hand you an admin panel so you never need me for content.', 4),
  ('Can I edit the site myself?', 'Absolutely. Everything on this site — projects, services, pricing, FAQs — is editable from a private admin panel. No code, no redeploys.', 5);

-- Testimonials (SAMPLE)
insert into public.testimonials (name, role, quote, sort_order) values
  ('Ananya S. (Sample)', 'Founder, Nova Retail', 'He took our store from a slow template to something customers compliment. Checkout feels effortless and sales followed.', 1),
  ('Rohit M. (Sample)', 'Product Lead, Pulse', 'Fast, communicative and genuinely cares about the end result. Shipped our dashboard two weeks ahead of plan.', 2);

-- Sample projects — cover images ship with the repo at /samples/*
insert into public.projects (slug, title, short_description, category, year, client_name, role, overview, problem, solution, key_features, tech_stack, results, cover_url, featured, published, sort_order) values
  ('novacart', 'NovaCart',
   'Headless e-commerce platform with real-time inventory, one-tap checkout and a conversion-tuned storefront.',
   'E-commerce', 2025, 'Nova Retail Co.', 'Design + Full-stack Development',
   'NovaCart is a complete storefront and operations platform for a growing retail brand: a blazing-fast storefront, an admin with live inventory and a checkout flow tuned end-to-end for conversion.',
   'The brand was running on a slow template store with 6-second loads, a 9-step checkout and inventory updated by hand across three spreadsheets.',
   'A custom Next.js storefront backed by a real-time data layer, a 2-tap checkout, and an operations dashboard with automatic stock sync, payment reconciliation and daily sales digests.',
   array['One-page express checkout with saved addresses','Real-time inventory sync across online + offline sales','Cart recovery emails and abandoned-checkout nudges','Admin dashboard with sales, margins and low-stock alerts'],
   array['Next.js','React','Tailwind CSS','Node.js','PostgreSQL','Vercel'],
   'Load time cut from 6.2s to 0.9s • Checkout completion up 34% • 4.8★ post-launch rating',
   '/samples/ecommerce-cover.jpg', true, true, 1),
  ('pulseboard', 'PulseBoard',
   'SaaS analytics dashboard turning raw product events into live charts, funnels and alerts teams actually check daily.',
   'Website', 2025, 'Pulse Analytics', 'Design + Frontend Development',
   'PulseBoard is a self-serve analytics workspace where product teams explore events, build funnels and set alerts without writing SQL.',
   'The team exported CSVs daily and stitched numbers in spreadsheets; nobody trusted the numbers because every team counted differently.',
   'A shared event model, a drag-and-drop report builder, sub-second charts over pre-aggregated data, and alerting that pushes to Slack the moment metrics cross thresholds.',
   array['Drag-and-drop report and funnel builder','Sub-second charts over 50M+ events','Threshold alerts pushed to Slack and email','Per-team workspaces with granular permissions'],
   array['React','TypeScript','Tailwind CSS','Node.js','Express','MongoDB'],
   'Daily active usage by 3 internal teams • Report build time from 2 hrs to 4 min',
   '/samples/dashboard-cover.jpg', true, true, 2),
  ('fitloop', 'FitLoop',
   'Cross-platform fitness app with adaptive workout plans, streak tracking and offline-first training logs.',
   'App', 2024, 'Independent launch', 'App Development',
   'FitLoop builds adaptive workout plans that react to how you actually trained — energy, soreness, skipped days — and keeps streaks alive with smart, non-nagging reminders.',
   'Generic fitness apps serve static plans; users quit within three weeks when life gets busy and the plan no longer fits.',
   'An adaptive planning engine that rebalances each week, offline-first logging, and a streak system that rewards consistency over perfection.',
   array['Adaptive weekly plans that auto-rebalance','Offline-first logs that sync when back online','Streaks, personal records and progress rings','Android + iOS from one codebase'],
   array['React','Node.js','Firebase','Tailwind CSS'],
   '4,000+ installs in first quarter • Week-4 retention at 41% vs 19% category average',
   '/samples/fitness-cover.jpg', false, true, 3),
  ('mindmesh', 'MindMesh',
   'AI chat assistant that answers from your own documents, cites sources and hands off to humans gracefully.',
   'AI', 2024, 'MindMesh Labs', 'AI Development',
   'MindMesh is a support assistant trained on a company''s docs, tickets and FAQs — it answers with citations, admits uncertainty, and escalates to a human with full context.',
   'Support spent 60% of its day answering the same twenty questions, and generic chatbots hallucinated answers the legal team had to walk back.',
   'A retrieval-augmented assistant over versioned docs with citation-backed answers, confidence thresholds, and a one-click human handoff that carries the whole thread.',
   array['Answers grounded in your own documents with citations','Confidence thresholds — says "I don''t know" when unsure','One-click handoff to a human with full context','Admin console for sources, prompts and analytics'],
   array['Next.js','Node.js','PostgreSQL','Supabase','AI / LLM Tools'],
   '68% of tier-1 tickets deflected • Median first response 4 seconds',
   '/samples/ai-cover.jpg', false, true, 4);

-- Gallery images for the samples
insert into public.project_images (project_id, url, sort_order)
select p.id, v.url, v.ord
from public.projects p
join (values
  ('novacart', '/samples/ecommerce-detail.jpg', 0),
  ('pulseboard', '/samples/dashboard-detail.jpg', 0),
  ('fitloop', '/samples/fitness-detail.jpg', 0),
  ('mindmesh', '/samples/ai-detail.jpg', 0)
) as v(slug, url, ord) on v.slug = p.slug
where not exists (select 1 from public.project_images pi where pi.project_id = p.id);

-- Link sample projects to tech_stack via the join table
insert into public.project_tech (project_id, tech_id)
select p.id, t.id
from public.projects p
join public.tech_stack t on t.name = any (p.tech_stack)
where not exists (select 1 from public.project_tech pt where pt.project_id = p.id and pt.tech_id = t.id);
