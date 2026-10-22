# BuildWithMe — Portfolio + Admin Panel

**Webs • Apps • And More** — *Ideas → Code → Reality.*

A production-ready portfolio for a freelance developer: an immersive dark site with a 3D hero, a
3-view work showcase (GSAP-pinned Showcase, animated Grid, typographic List), case-study pages,
and a private **/admin** panel where the owner manages **everything** — projects, services, tech
stack, testimonials, FAQs, stats, inquiries and site settings — with no code changes or redeploys.

## Stack

- **Next.js 14 (App Router) + TypeScript**, Server Components + Server Actions
- **Tailwind CSS + shadcn/ui-style components** (admin)
- **Framer Motion + GSAP ScrollTrigger + Lenis** (scroll storytelling, smooth scroll)
- **React Three Fiber + drei** — the glossy two-ribbon "W" logo (lazy-loaded, CSS fallback on low-end devices / reduced motion)
- **Supabase** — Postgres, Auth, Storage, RLS (`@supabase/ssr`)
- **Zod + react-hook-form** everywhere input happens
- Deploys to **Vercel**

## 1. Supabase setup (one time, ~2 minutes)

1. Open your Supabase project → **SQL Editor → New query**.
2. Paste the whole of `supabase/migrations/0001_schema.sql` → **Run**.
   (Tables, RLS policies, the `portfolio-media` storage bucket.)
3. Paste the whole of `supabase/migrations/0002_seed.sql` → **Run**.
   (Settings, services, tech stack, FAQs, stats + 4 **sample projects** — clearly marked,
   deletable from the admin panel later.)

> The seed references cover images that ship with this repo at `public/samples/*`, so the site
> looks complete immediately.

## 2. Create the admin user

```bash
npm install            # or: yarn install --ignore-engines  (if your Node < 22 warns on engines)
npm run create-admin admin@buildwithme.dev YourPasswordHere
```

This creates a confirmed auth user, sets the password and grants admin via the `admins` table.
You can also change `ADMIN_EMAIL` in `.env.local` — that email is trusted automatically.

## 3. Environment variables

`.env.local` (already included with this project's keys — see `.env.example` for a template):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # server-only, used just by scripts/create-admin.mjs
ADMIN_EMAIL=admin@buildwithme.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # your production URL when deployed
```

> `SUPABASE_SERVICE_ROLE_KEY` is never used in client code — only the Node script.

## 4. Run locally

```bash
npm run dev     # http://localhost:3000
```

- Public site: `/`
- Admin panel: `/admin` (login at `/admin/login`)
- Branded 404 at any unknown route · sitemap at `/sitemap.xml`

## 5. Deploy to Vercel

1. Push this folder to a Git repo and import it in Vercel.
2. Add the five env vars above (set `NEXT_PUBLIC_SITE_URL` to your final domain).
3. Deploy — done. Admin edits appear on the public site **instantly** (server actions call
   `revalidatePath`); no redeploys needed.

## Admin panel — what you can manage

| Area | What you can do |
|---|---|
| **Projects** | Add / edit / duplicate / delete, drag-and-drop ordering, featured star, draft↔published, bulk publish, search. Cover image + preview video + gallery with drag-reorder (client-side compression + upload progress). Live preview of card + case-study hero while editing. |
| **Services** | Full CRUD, "what's included" list, starting price, visibility toggle |
| **Tech stack** | Full CRUD, feeds the orbit + tech filter |
| **Testimonials** | Full CRUD + visibility (section auto-hides when empty) |
| **FAQs** | Full CRUD + visibility |
| **Stats** | Animated counters: label, value, suffix, visibility |
| **Inquiries** | Contact-form inbox: search, new/replied/closed status, delete, CSV export |
| **Site settings** | Hero copy, badge, about text, Instagram/WhatsApp/email, SEO title/description, OG image, availability toggle |
| **Media library** | Browse + delete every uploaded file |

## Security model

- Public visitors (anon): read **published/visible** rows only; may **insert** into `inquiries`
  (length-checked); no read access to inquiries.
- Admin: full access via RLS `is_admin()` (checks the `admins` table). The `/admin` area is
  protected by **middleware** and re-verified **server-side in every server action**.
- Storage bucket `portfolio-media`: public read, admin-only write.

## Project structure

```
app/               # routes (public, /admin, case studies, sitemap, robots, OG images)
components/public/ # hero, 3D logo, work showcase (3 views), sections, cursor, preloader...
components/admin/  # projects manager, project form, generic CRUD manager, media uploader
components/ui/     # shadcn-style primitives
actions/           # server actions (projects, content, inquiries, media, auth)
lib/               # supabase clients, validators (zod), data fetchers with graceful fallback
supabase/migrations/ # schema + seed SQL
scripts/create-admin.mjs
public/samples/    # sample project artwork used by the seed
```

## Good to know

- The site **never looks broken** even before migrations are run: `lib/data.ts` falls back to
  clearly-marked sample content, and the admin shows friendly empty states. Run the two SQL
  files and everything goes live.
- Type `b-u-i-l-d` anywhere on the site for a light show. ✦
- If `npm install` complains about engines (Node 20), run `yarn install --ignore-engines` or use Node 22.
