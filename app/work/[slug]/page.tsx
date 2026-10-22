import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react';
import GalleryLightbox from '@/components/public/gallery-lightbox';
import { getProjectBySlug, getProjectNeighbors, getSettings } from '@/lib/data';
import { waLink } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProjectBySlug(params.slug);
  if (!p) return { title: 'Project not found' };
  return {
    title: `${p.title} — Case Study`,
    description: p.short_description,
    openGraph: { title: p.title, description: p.short_description, images: p.cover_url ? [{ url: p.cover_url }] : undefined },
  };
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const p = await getProjectBySlug(params.slug);
  if (!p) notFound();
  const [{ prev, next }, settings] = await Promise.all([getProjectNeighbors(params.slug), getSettings()]);
  const gallery = (p.images ?? []).map((i) => i.url);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.title,
    description: p.short_description,
    genre: p.category,
    dateCreated: String(p.year),
    url: `/work/${p.slug}`,
    ...(p.cover_url ? { image: p.cover_url } : {}),
  };

  const Meta = ({ label, value }: { label: string; value: string | null | undefined }) =>
    value ? (
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    ) : null;

  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        {p.cover_url && (
          <Image src={p.cover_url} alt={p.title} fill priority sizes="100vw" className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 md:px-8">
          <Link href="/#work" className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-white/60 hover:text-white" data-cursor="Open">
            <ArrowLeft size={14} /> All work
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-electric/15 border border-electric/30 px-3 py-1 text-electric">{p.category}</span>
            <span className="rounded-full glass px-3 py-1 font-mono text-white/70">{p.year}</span>
            {p.featured && <span className="rounded-full bg-amber-400/90 px-3 py-1 font-bold text-black">Featured</span>}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl" data-testid="case-title">{p.title}</h1>
          <p className="mt-4 max-w-2xl text-white/65" data-testid="case-short">{p.short_description}</p>
          <div className="mt-8 flex flex-wrap gap-8">
            <Meta label="Client" value={p.client_name} />
            <Meta label="My role" value={p.role} />
            <Meta label="Year" value={String(p.year)} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {p.live_url && (
              <a href={p.live_url} target="_blank" rel="noreferrer" data-cursor="Open" data-testid="case-live"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett px-6 py-3 text-sm font-semibold transition-transform hover:scale-105">
                <ExternalLink size={15} /> Live Demo
              </a>
            )}
            {p.github_url && (
              <a href={p.github_url} target="_blank" rel="noreferrer" data-cursor="Open" data-testid="case-github"
                className="flex items-center gap-2 rounded-full glass px-6 py-3 text-sm font-semibold transition-all hover:bg-white/10">
                <Github size={15} /> Source Code
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        {p.overview && (
          <section className="mb-14">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-electric">Overview</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/75" data-testid="case-overview">{p.overview}</p>
          </section>
        )}
        {(p.problem || p.solution) && (
          <section className="mb-14 grid gap-6 md:grid-cols-2">
            {p.problem && (
              <div className="rounded-2xl glass p-6">
                <h3 className="font-display font-bold text-red-300">The problem</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{p.problem}</p>
              </div>
            )}
            {p.solution && (
              <div className="rounded-2xl glass p-6">
                <h3 className="font-display font-bold text-emerald-300">The solution</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{p.solution}</p>
              </div>
            )}
          </section>
        )}
        {!!p.key_features.length && (
          <section className="mb-14">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-electric">Key features</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {p.key_features.map((f) => (
                <li key={f} className="flex items-start gap-3 rounded-xl glass px-4 py-3 text-sm text-white/75">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-electric to-violett" />
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}
        {p.results && (
          <section className="mb-14 rounded-2xl p-6 ring-gradient md:p-8" data-testid="case-results">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-electric">Results</h2>
            <p className="mt-3 font-display text-lg md:text-2xl font-semibold leading-relaxed">{p.results}</p>
          </section>
        )}
        {p.video_url && (
          <section className="mb-14">
            <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-electric">Preview</h2>
            <video src={p.video_url} controls playsInline className="w-full rounded-2xl border border-white/10" />
          </section>
        )}
        {!!gallery.length && (
          <section className="mb-14">
            <h2 className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-electric">Gallery</h2>
            <GalleryLightbox images={gallery} title={p.title} />
          </section>
        )}
        {!!p.tech_stack.length && (
          <section className="mb-16">
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-electric">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {p.tech_stack.map((t) => (
                <span key={t} className="rounded-full glass px-4 py-1.5 font-mono text-xs text-white/75">{t}</span>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl bg-gradient-to-br from-electric/15 via-transparent to-violett/20 p-8 text-center ring-1 ring-white/10 md:p-14">
          <h2 className="font-display text-2xl font-bold md:text-4xl">
            Want something like <span className="text-gradient">this?</span> Let&apos;s talk.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/60">Tell me about your idea — I&apos;ll reply with an honest plan and quote.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={`/#contact`} data-cursor="Open" className="rounded-full bg-gradient-to-r from-electric to-violett px-7 py-3.5 text-sm font-semibold transition-transform hover:scale-105">
              Start a project
            </a>
            <a href={waLink(settings.whatsapp)} target="_blank" rel="noreferrer" data-cursor="Open" className="rounded-full glass px-7 py-3.5 text-sm font-semibold transition-all hover:bg-white/10">
              WhatsApp me
            </a>
          </div>
        </section>
      </div>

      {(prev || next) && (
        <nav className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 md:grid-cols-2 md:px-8" data-testid="case-nav">
          {[{ p: prev, label: 'Previous', icon: ArrowLeft, align: 'order-first' }, { p: next, label: 'Next', icon: ArrowRight, align: '' }].map(({ p: n, label, icon: Icon, align }) =>
            n ? (
              <Link key={label} href={`/work/${n.slug}`} data-cursor="Open" data-testid={`case-${label.toLowerCase()}`}
                className={`group flex items-center justify-between gap-4 rounded-2xl glass p-5 transition-all hover:bg-white/10 ${align}`}>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label} project</span>
                  <span className="mt-1 block truncate font-display text-lg font-bold group-hover:text-gradient">{n.title}</span>
                </span>
                <Icon size={18} className="shrink-0 text-white/40 group-hover:text-electric" />
              </Link>
            ) : null
          )}
        </nav>
      )}
    </main>
  );
}
