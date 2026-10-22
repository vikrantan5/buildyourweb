'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const STEPS = [
  { title: 'Discuss', text: 'A short call to understand your idea, goals and budget. You get an honest quote — fast.' },
  { title: 'Plan & Design', text: 'Wireframes and high-fidelity designs you approve before a single line of code is written.' },
  { title: 'Development', text: 'You watch it come alive with weekly previews and a staging link from day one.' },
  { title: 'Testing & Revisions', text: 'Real-device testing, performance tuning and your revision rounds until it feels right.' },
  { title: 'Launch & Support', text: 'Deploy to production, hand over the admin panel, and 30 days of free support after.' },
];

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="process" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-[0.35em] text-electric">05 — How It Works</p>
        <h2 className="mt-3 text-center font-display text-3xl md:text-5xl font-bold tracking-tight">
          From idea to <span className="text-gradient">launch</span> in five steps
        </h2>

        <div ref={ref} className="relative mt-16 pl-8 md:pl-0" data-testid="process-timeline">
          <div className="absolute left-[7px] md:left-1/2 top-0 h-full w-[2px] bg-white/8 md:-translate-x-1/2" />
          <motion.div
            style={{ scaleY }}
            className="absolute left-[7px] md:left-1/2 top-0 h-full w-[2px] origin-top bg-gradient-to-b from-electric to-violett md:-translate-x-1/2"
          />
          <div className="space-y-12">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
                className={`relative flex md:w-1/2 ${i % 2 ? 'md:ml-auto md:pl-12' : 'md:pr-12 md:text-right'}`}
              >
                <span className="absolute -left-8 md:-left-[6.2rem] md:right-auto top-0 flex h-8 w-8 items-center justify-center rounded-full glass-strong font-mono text-xs text-electric md:top-0"
                  style={i % 2 ? undefined : { left: 'auto', right: '-4.2rem' }}
                >
                  {i + 1}
                </span>
                <div className="rounded-2xl glass p-5 w-full text-left">
                  <h3 className="font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-white/60">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
