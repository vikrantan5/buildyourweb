'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/types/database';

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section id="testimonials" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-electric">07 — Testimonials</p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight">
          Kind words from <span className="text-gradient">clients</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="testimonials">
          {items.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="relative rounded-2xl glass p-6"
            >
              <Quote size={22} className="mb-4 text-electric/70" />
              <blockquote className="text-sm leading-relaxed text-white/75">“{t.quote}”</blockquote>
              <figcaption className="mt-5 border-t border-white/8 pt-4">
                <p className="font-display text-sm font-bold">{t.name}</p>
                {t.role && <p className="text-xs text-white/50">{t.role}</p>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
