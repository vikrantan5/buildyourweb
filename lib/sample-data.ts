import type { Faq, Project, Service, SiteSettings, Stat, TechStackItem, Testimonial } from '@/types/database';

/** Fallback content used only when Supabase is unreachable / migrations not yet run. */

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  hero_title: 'Turn Your Ideas Into Real Products',
  hero_subtitle:
    'I design and build websites, mobile apps, UI/UX and AI solutions that ship fast, look stunning and perform even better.',
  hero_badge: 'Available for projects',
  tagline: 'Webs • Apps • And More',
  subline: 'Ideas → Code → Reality',
  about_title: 'About BuildWithMe',
  about_text:
    'I am a freelance developer who turns rough ideas into polished, production-grade products — websites, mobile apps, thoughtful UI/UX and AI-powered tools. One person, end-to-end: strategy, design, code, launch and support. No agencies, no hand-offs, no lost-in-translation. You talk directly to the person building your product.',
  instagram: 'buildwithme',
  whatsapp: '919999999999',
  email: 'hello@buildwithme.dev',
  seo_title: 'BuildWithMe — Webs • Apps • And More',
  seo_description:
    'Freelance developer building websites, mobile apps, UI/UX and AI solutions. Ideas → Code → Reality.',
  og_image: null,
  available_for_work: true,
};

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'sample-1',
    slug: 'novacart',
    title: 'NovaCart',
    short_description:
      'Headless e-commerce platform with real-time inventory, one-tap checkout and a conversion-tuned storefront.',
    category: 'E-commerce',
    year: 2025,
    client_name: 'Nova Retail Co.',
    role: 'Design + Full-stack Development',
    overview:
      'NovaCart is a complete storefront and operations platform for a growing retail brand: a blazing-fast storefront, an admin with live inventory and an checkout flow tuned end-to-end for conversion.',
    problem:
      'The brand was running on a slow template store with 6-second loads, a 9-step checkout and inventory updated by hand across three spreadsheets.',
    solution:
      'A custom Next.js storefront backed by a real-time data layer, a 2-tap checkout, and an operations dashboard with automatic stock sync, payment reconciliation and daily sales digests.',
    key_features: [
      'One-page express checkout with saved addresses',
      'Real-time inventory sync across online + offline sales',
      'Cart recovery emails and abandoned-checkout nudges',
      'Admin dashboard with sales, margins and low-stock alerts',
    ],
    tech_stack: ['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Vercel'],
    live_url: null,
    github_url: null,
    results: 'Load time cut from 6.2s to 0.9s • Checkout completion up 34% • 4.8★ post-launch rating',
    cover_url: '/samples/ecommerce-cover.jpg',
    video_url: null,
    featured: true,
    published: true,
    sort_order: 1,
    images: [{ id: 's1g1', project_id: 'sample-1', url: '/samples/ecommerce-detail.jpg', sort_order: 0 }],
  },
  {
    id: 'sample-2',
    slug: 'pulseboard',
    title: 'PulseBoard',
    short_description:
      'SaaS analytics dashboard turning raw product events into live charts, funnels and alerts teams actually check daily.',
    category: 'Website',
    year: 2025,
    client_name: 'Pulse Analytics',
    role: 'Design + Frontend Development',
    overview:
      'PulseBoard is a self-serve analytics workspace where product teams explore events, build funnels and set alerts without writing SQL.',
    problem:
      'The team exported CSVs daily and stitched numbers in spreadsheets; nobody trusted the numbers because every team counted differently.',
    solution:
      'A shared event model, a drag-and-drop report builder, sub-second charts over pre-aggregated data, and alerting that pushes to Slack the moment metrics cross thresholds.',
    key_features: [
      'Drag-and-drop report and funnel builder',
      'Sub-second charts over 50M+ events',
      'Threshold alerts pushed to Slack and email',
      'Per-team workspaces with granular permissions',
    ],
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB'],
    live_url: null,
    github_url: null,
    results: 'Daily active usage by 3 internal teams • Report build time from 2 hrs to 4 min',
    cover_url: '/samples/dashboard-cover.jpg',
    video_url: null,
    featured: true,
    published: true,
    sort_order: 2,
    images: [{ id: 's2g1', project_id: 'sample-2', url: '/samples/dashboard-detail.jpg', sort_order: 0 }],
  },
  {
    id: 'sample-3',
    slug: 'fitloop',
    title: 'FitLoop',
    short_description:
      'Cross-platform fitness app with adaptive workout plans, streak tracking and offline-first training logs.',
    category: 'App',
    year: 2024,
    client_name: 'Independent launch',
    role: 'App Development',
    overview:
      'FitLoop builds adaptive workout plans that react to how you actually trained — energy, soreness, skipped days — and keeps streaks alive with smart, non-nagging reminders.',
    problem:
      'Generic fitness apps serve static plans; users quit within three weeks when life gets busy and the plan no longer fits.',
    solution:
      'An adaptive planning engine that rebalances each week, offline-first logging, and a streak system that rewards consistency over perfection.',
    key_features: [
      'Adaptive weekly plans that auto-rebalance',
      'Offline-first logs that sync when back online',
      'Streaks, personal records and progress rings',
      'Android + iOS from one codebase',
    ],
    tech_stack: ['React', 'Node.js', 'Firebase', 'Tailwind CSS'],
    live_url: null,
    github_url: null,
    results: '4,000+ installs in first quarter • Week-4 retention at 41% vs 19% category average',
    cover_url: '/samples/fitness-cover.jpg',
    video_url: null,
    featured: false,
    published: true,
    sort_order: 3,
    images: [{ id: 's3g1', project_id: 'sample-3', url: '/samples/fitness-detail.jpg', sort_order: 0 }],
  },
  {
    id: 'sample-4',
    slug: 'mindmesh',
    title: 'MindMesh',
    short_description:
      'AI chat assistant that answers from your own documents, cites sources and hands off to humans gracefully.',
    category: 'AI',
    year: 2024,
    client_name: 'MindMesh Labs',
    role: 'AI Development',
    overview:
      'MindMesh is a support assistant trained on a company’s docs, tickets and FAQs — it answers with citations, admits uncertainty, and escalates to a human with full context.',
    problem:
      'Support spent 60% of its day answering the same twenty questions, and generic chatbots hallucinated answers the legal team had to walk back.',
    solution:
      'A retrieval-augmented assistant over versioned docs with citation-backed answers, confidence thresholds, and a one-click human handoff that carries the whole thread.',
    key_features: [
      'Answers grounded in your own documents with citations',
      'Confidence thresholds — says “I don’t know” when unsure',
      'One-click handoff to a human with full context',
      'Admin console for sources, prompts and analytics',
    ],
    tech_stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Supabase', 'AI / LLM Tools'],
    live_url: null,
    github_url: null,
    results: '68% of tier-1 tickets deflected • Median first response 4 seconds',
    cover_url: '/samples/ai-cover.jpg',
    video_url: null,
    featured: false,
    published: true,
    sort_order: 4,
    images: [{ id: 's4g1', project_id: 'sample-4', url: '/samples/ai-detail.jpg', sort_order: 0 }],
  },
];

export const SAMPLE_SERVICES: Service[] = [
  {
    id: 'srv-1',
    title: 'Website Development',
    description:
      'Marketing sites, business websites and e-commerce stores built to load fast, rank well and convert visitors.',
    features: ['Custom design (no templates)', 'SEO + performance setup', 'Admin panel to edit content', 'E-commerce from ₹7,000–₹10,000'],
    price: '₹7,000 – ₹10,000',
    icon: 'Globe',
    visible: true,
    sort_order: 1,
  },
  {
    id: 'srv-2',
    title: 'App Development',
    description: 'Android + iOS apps from one codebase — idea to Play Store and App Store, with post-launch support.',
    features: ['Android + iOS from one codebase', 'Auth, payments, notifications', 'Store listing + launch help', '30 days free bug support'],
    price: '₹15,000',
    icon: 'Smartphone',
    visible: true,
    sort_order: 2,
  },
  {
    id: 'srv-3',
    title: 'UI/UX Design',
    description: 'Interfaces users understand in seconds — wireframes, design systems and pixel-perfect handoff.',
    features: ['User flows + wireframes', 'High-fidelity designs', 'Interactive prototype', 'Developer-ready handoff'],
    price: '₹4,000 onwards',
    icon: 'PenTool',
    visible: true,
    sort_order: 3,
  },
  {
    id: 'srv-4',
    title: 'AI & More',
    description: 'Chatbots, automation and AI features woven into your product — grounded in your own data.',
    features: ['Chatbots trained on your docs', 'Workflow automation', 'AI features in existing apps', 'Integrations & APIs'],
    price: 'Custom quote',
    icon: 'Sparkles',
    visible: true,
    sort_order: 4,
  },
];

export const SAMPLE_TECH: TechStackItem[] = [
  'React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Firebase', 'Tailwind CSS', 'AWS / Vercel', 'Supabase', 'AI / LLM Tools',
].map((name, i) => ({ id: `tech-${i}`, name, icon: null, description: null, visible: true, sort_order: i }));

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Ananya S. (Sample)',
    role: 'Founder, Nova Retail',
    quote: 'He took our store from a slow template to something customers compliment. Checkout feels effortless and sales followed.',
    avatar_url: null,
    visible: true,
    sort_order: 1,
  },
  {
    id: 't-2',
    name: 'Rohit M. (Sample)',
    role: 'Product Lead, Pulse',
    quote: 'Fast, communicative and genuinely cares about the end result. Shipped our dashboard two weeks ahead of plan.',
    avatar_url: null,
    visible: true,
    sort_order: 2,
  },
];

export const SAMPLE_FAQS: Faq[] = [
  { id: 'f-1', question: 'How much does a website cost?', answer: 'E-commerce and business websites start at ₹7,000–₹10,000 depending on pages and features. You get a fixed quote after one short call — no hourly surprises.', visible: true, sort_order: 1 },
  { id: 'f-2', question: 'How long does a mobile app take?', answer: 'A typical Android + iOS app ships in 3–6 weeks depending on scope. You get a working preview from week one, not a big reveal at the end.', visible: true, sort_order: 2 },
  { id: 'f-3', question: 'Do you work with clients outside India?', answer: 'Yes. Projects run over video calls and everything — designs, demos, invoices — is shared async so time zones never slow us down.', visible: true, sort_order: 3 },
  { id: 'f-4', question: 'What if I need changes after launch?', answer: 'Every project includes 30 days of free bug support. After that, small edits are quick and cheap — or I can hand you an admin panel so you never need me for content.', visible: true, sort_order: 4 },
  { id: 'f-5', question: 'Can I edit the site myself?', answer: 'Absolutely. Everything on this site — projects, services, pricing, FAQs — is editable from a private admin panel. No code, no redeploys.', visible: true, sort_order: 5 },
];

export const SAMPLE_STATS: Stat[] = [
  { id: 'st-1', label: 'Projects completed', value: 20, suffix: '+', visible: true, sort_order: 1 },
  { id: 'st-2', label: 'Technologies mastered', value: 15, suffix: '+', visible: true, sort_order: 2 },
  { id: 'st-3', label: 'Happy clients', value: 12, suffix: '+', visible: true, sort_order: 3 },
  { id: 'st-4', label: 'On-time delivery', value: 100, suffix: '%', visible: true, sort_order: 4 },
];
