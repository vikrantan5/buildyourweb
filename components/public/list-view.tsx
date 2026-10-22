'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/database';
import { cn } from '@/lib/utils';

export default function ListView({ projects }: { projects: Project[] }) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26 });
  const sy = useSpring(my, { stiffness: 220, damping: 26 });
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto max-w-7xl px-5 md:px-8"
      onMouseMove={(e) => {
        const r = wrapRef.current!.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      data-testid="list-view"
    >
      <AnimatePresence>
        {hovered && hovered.cover_url && (
          <motion.div
            key={hovered.id}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 3 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            style={{ x: sx, y: sy }}
            className="pointer-events-none absolute z-30 hidden md:block h-56 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            data-testid="list-hover-image"
          >
            <Image src={hovered.cover_url} alt="" fill sizes="320px" className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-white/8">
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: i * 0.04 }}
          >
            <Link
              href={`/work/${p.slug}`}
              data-cursor="View"
              data-testid={`list-row-${p.slug}`}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              className="group flex items-baseline justify-between gap-4 border-b border-white/8 py-7 transition-colors hover:bg-white/[0.02] md:py-9"
            >
              <div className="flex items-baseline gap-4 md:gap-8">
                <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, '0')}</span>
                <h3
                  className={cn(
                    'font-display font-bold tracking-tight text-2xl md:text-5xl transition-all duration-300 group-hover:translate-x-2',
                    hovered?.id === p.id ? 'text-gradient' : 'text-white/85'
                  )}
                >
                  {p.title}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-3 md:gap-6">
                <span className="hidden md:inline text-xs font-medium text-electric">{p.category}</span>
                <span className="font-mono text-xs text-white/40">{p.year}</span>
                <ArrowUpRight size={20} className="text-white/30 transition-all group-hover:text-electric group-hover:rotate-45" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
