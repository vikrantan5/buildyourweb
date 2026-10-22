'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Globe, PenTool, Smartphone, Sparkles, Wrench } from 'lucide-react';
import type { Service } from '@/types/database';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ElementType> = { Globe, Smartphone, PenTool, Sparkles, Wrench };

function TiltCard({ service, i }: { service: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const Icon = ICONS[service.icon] ?? Sparkles;

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setTilt({
      ry: ((e.clientX - r.left) / r.width - 0.5) * 12,
      rx: -((e.clientY - r.top) / r.height - 0.5) * 10,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: i * 0.08 }}
      className="[perspective:1000px]"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
        style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        data-cursor="Open"
        data-testid={`service-card-${i}`}
        className="group relative h-full rounded-2xl glass p-6 transition-all duration-200 hover:shadow-[0_24px_80px_rgba(124,58,237,0.22)]"
      >
        <div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-electric/20 to-violett/20 p-3 ring-1 ring-white/10">
          <Icon size={22} className="text-electric" />
        </div>
        <h3 className="font-display text-xl font-bold">{service.title}</h3>
        <p className="mt-2 text-sm text-white/60">{service.description}</p>
        <ul className="mt-4 space-y-2">
          {(service.features ?? []).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-white/75">
              <Check size={15} className="mt-0.5 shrink-0 text-emerald-400" /> {f}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
          <span className="font-mono text-xs text-white/45">starting at</span>
          <span className="font-display text-lg font-bold text-gradient">{service.price}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.35em] text-electric">03 — Services</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-5xl font-bold tracking-tight">
          Everything you need to <span className="text-gradient">launch</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-testid="services-grid">
          {services.map((s, i) => (
            <TiltCard key={s.id} service={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
