'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, MonitorPlay, Rows3 } from 'lucide-react';
import type { Project } from '@/types/database';
import { CATEGORIES, cn } from '@/lib/utils';

const ShowcaseView = dynamic(() => import('./showcase-view'), { ssr: false });

type View = 'showcase' | 'grid' | 'list';
const VIEWS: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'showcase', label: 'Showcase', icon: MonitorPlay },
  { id: 'grid', label: 'Grid', icon: LayoutGrid },
  { id: 'list', label: 'List', icon: Rows3 },
];

const GridView = dynamic(() => import('./grid-view'), { ssr: false });
const ListView = dynamic(() => import('./list-view'), { ssr: false });

export default function WorkSection({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<View>('showcase');
  const [category, setCategory] = useState<string>('All');
  const [tech, setTech] = useState<string>('All');

  const allTech = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tech_stack))).sort(),
    [projects]
  );

  const filtered = useMemo(() => {
    return projects
      .filter((p) => (category === 'All' || p.category === category))
      .filter((p) => (tech === 'All' || p.tech_stack.includes(tech)));
  }, [projects, category, tech]);

  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-electric">02 — Selected Work</p>
            <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight" data-testid="work-heading">
              Work that <span className="text-gradient">ships</span>
            </h2>
          </div>
          <div className="flex items-center gap-1 rounded-full glass p-1" data-testid="view-toggle" role="tablist" aria-label="Project view">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={view === id}
                data-testid={`view-${id}`}
                onClick={() => setView(id)}
                data-cursor="Open"
                className={cn(
                  'relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors md:text-sm',
                  view === id ? 'text-white' : 'text-white/50 hover:text-white/80'
                )}
              >
                {view === id && (
                  <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-gradient-to-r from-electric/80 to-violett/80" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <Icon size={14} className="relative z-10" />
                <span className="relative z-10 hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2" data-testid="work-filters">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              data-cursor="Open"
              data-testid={`filter-${c.toLowerCase().replace('/', '-')}`}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all',
                category === c
                  ? 'border-electric/60 bg-electric/20 text-electric'
                  : 'border-white/10 bg-white/[0.03] text-white/55 hover:text-white'
              )}
            >
              {c}
            </button>
          ))}
          <select
            aria-label="Filter by tech stack"
            data-testid="filter-tech"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="ml-auto rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-white/70 outline-none focus:border-electric/60"
          >
            <option value="All">All tech</option>
            {allTech.map((t) => (
              <option key={t} value={t} className="bg-panel">{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-12" data-testid="work-views">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-white/50">
            Nothing matches this filter yet.{' '}
            <button onClick={() => { setCategory('All'); setTech('All'); }} className="text-electric underline underline-offset-4">
              Clear filters
            </button>
          </p>
        ) : view === 'showcase' ? (
          <ShowcaseView key={`${category}-${tech}`} projects={filtered} />
        ) : view === 'grid' ? (
          <GridView projects={filtered} />
        ) : (
          <ListView projects={filtered} />
        )}
      </div>
    </section>
  );
}
