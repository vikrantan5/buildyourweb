'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Sparkles } from 'lucide-react';
import type { TechStackItem } from '@/types/database';
import { LogoMark } from './nav';
import { cn } from '@/lib/utils';

function iconFor(name: string) {
  const n = name.toLowerCase();
  if (n.includes('ai') || n.includes('llm')) return Sparkles;
  return Layers;
}

export default function Orbit({ items }: { items: TechStackItem[] }) {
  const [paused, setPaused] = useState(false);

    const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = wrapRef.current?.clientWidth ?? 672;
      setScale(Math.min(1, Math.max(0.52, (w - 12) / 560)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!items.length) return null;
  const rings = [items.slice(0, Math.ceil(items.length / 2)), items.slice(Math.ceil(items.length / 2))].filter((r) => r.length);

  return (
    <section id="stack" className="relative py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-[0.35em] text-electric">04 — Tech Stack</p>
        <h2 className="mt-3 text-center font-display text-3xl md:text-5xl font-bold tracking-tight">
          Tools I <span className="text-gradient">build with</span>
        </h2>

        <div
           ref={wrapRef}
          className="relative mx-auto mt-16 w-full max-w-2xl"
          style={{ height: Math.round(460 * scale) + 60 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          data-testid="tech-orbit"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-2xl glass-strong p-4 shadow-[0_0_60px_rgba(14,165,255,0.25)]">
              <LogoMark size={44} />
            </div>
          </div>

          {rings.map((ring, ri) => {
           const radius = Math.round((ri === 0 ? 150 : 215) * scale);
            const duration = ri === 0 ? 26 : 38;
            return (
              <div
                key={ri}
                className={cn('absolute left-1/2 top-1/2', !paused && 'animate-spin-slow')}
                style={{
                  width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius,
                  animationDuration: `${duration}s`, animationDirection: ri % 2 ? 'reverse' : 'normal',
                  border: '1px dashed rgba(255,255,255,0.07)', borderRadius: '50%',
                }}
              >
                {ring.map((item, i) => {
                  const angle = (i / ring.length) * Math.PI * 2;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const Icon = iconFor(item.name);
                  return (
                    <div
                      key={item.id}
                      className="absolute"
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                    >
                      <div
                        className={cn('flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full glass px-3 py-1.5', !paused && 'animate-spin-slow')}
                        style={{ animationDuration: `${duration}s`, animationDirection: ri % 2 ? 'normal' : 'reverse' }}
                        title={item.description || item.name}
                      >
                        <Icon size={13} className="text-electric" />
                        <span className="whitespace-nowrap font-mono text-[11px] text-white/80">{item.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center text-sm text-white/40"
        >
          Hover to pause the orbit — {items.length} technologies, one stack.
        </motion.p>
      </div>
    </section>
  );
}
