'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { SiteSettings, Stat } from '@/types/database';

function Counter({ value, suffix }: { value: number; suffix: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return <span ref={ref} data-testid="stat-counter">{n}{suffix ?? ''}</span>;
}

export default function About({ settings, stats }: { settings: SiteSettings; stats: Stat[] }) {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[1.2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-electric">06 — About</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight">{settings.about_title}</h2>
          <p className="mt-6 max-w-xl leading-relaxed text-white/65" data-testid="about-text">{settings.about_text}</p>
          <a
            href="#contact"
            data-cursor="Open"
            className="mt-8 inline-flex rounded-full glass px-6 py-3 text-sm font-semibold transition-all hover:bg-white/10"
          >
            Let&apos;s work together
          </a>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 self-center" data-testid="stats-grid">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-2xl glass p-6 text-center"
              data-testid={`stat-${i}`}
            >
              <p className="font-display text-4xl font-bold text-gradient">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1.5 text-xs text-white/55">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
