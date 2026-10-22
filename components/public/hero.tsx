'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Instagram } from 'lucide-react';
import Particles from './particles';
import WLogo from './w-logo';
import { igLink } from '@/lib/utils';

function useHeroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('bwm:loaded')) {
      const t = setTimeout(() => setReady(true), 80);
      return () => clearTimeout(t);
    }
    const on = () => setTimeout(() => setReady(true), 120);
    window.addEventListener('bwm:ready', on, { once: true });
    return () => window.removeEventListener('bwm:ready', on);
  }, []);
  return ready;
}

function RevealLine({ text, delay, gradient }: { text: string; delay: number; gradient?: boolean }) {
  const ready = useHeroReady();
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className={`block ${gradient ? 'text-gradient' : ''}`}
        initial={{ y: '110%' }}
        animate={ready ? { y: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function Hero({ settings }: { settings: { hero_title: string; hero_subtitle: string; tagline: string; subline: string; hero_badge: string; available_for_work: boolean; instagram: string } }) {
  const ready = useHeroReady();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setParallax({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const words = settings.hero_title.split(' ').filter(Boolean);
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  return (
    <section id="top" className="relative min-h-screen overflow-hidden flex flex-col">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-electric/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-violett/25 blur-[120px] animate-pulse-glow" />
      </div>
      <Particles />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 md:px-8 pt-24 pb-16 lg:grid-cols-[1.15fr_1fr] lg:pt-16">
        <motion.div style={{ transform: `translate3d(${parallax.x * -10}px, ${parallax.y * -8}px, 0)` }}>
          {settings.available_for_work && (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              data-testid="available-badge"
              className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-emerald-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {settings.hero_badge}
            </motion.span>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight" data-testid="hero-title">
            <RevealLine text={line1} delay={0.05} />
            <RevealLine text={line2} delay={0.18} gradient />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 max-w-xl text-base md:text-lg text-white/65"
            data-testid="hero-subtitle"
          >
            {settings.hero_subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.55 }}
            className="mt-4 font-mono text-xs md:text-sm text-electric/90"
          >
            {settings.tagline} <span className="text-white/40">//</span> {settings.subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="mt-9 flex flex-wrap items-center gap-4"
            data-testid="hero-ctas"
          >
            <a
              href="#work"
              data-cursor="Open"
              data-testid="hero-cta-work"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-electric to-violett px-7 py-3.5 font-semibold text-white transition-transform hover:scale-[1.04] active:scale-95"
            >
              <span className="relative z-10">View My Work</span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-0" />
            </a>
            <a
              href={igLink(settings.instagram)}
              target="_blank"
              rel="noreferrer"
              data-cursor="Open"
              data-testid="hero-cta-instagram"
              className="glass rounded-full px-7 py-3.5 font-semibold text-white/90 transition-all hover:bg-white/10 hover:scale-[1.04]"
            >
              <span className="flex items-center gap-2"><Instagram size={17} /> DM on Instagram</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ transform: `translate3d(${parallax.x * 14}px, ${parallax.y * 10}px, 0)` }}
          className="relative h-[300px] sm:h-[380px] lg:h-[520px]"
          data-testid="hero-3d"
        >
          <WLogo />
        </motion.div>
      </div>

      <motion.a
        href="#work"
        aria-label="Scroll to work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative mx-auto mb-6 hidden md:flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
