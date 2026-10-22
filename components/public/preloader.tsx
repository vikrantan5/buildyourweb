'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LINES = ['> initializing BuildWithMe...', '> loading modules [ok]', '> compiling ideas...', '> ready ✦'];

export function markLoaded() {
  sessionStorage.setItem('bwm:loaded', '1');
  window.dispatchEvent(new Event('bwm:ready'));
}

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('bwm:loaded')) {
      markLoaded();
      setDone(true);
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    const timers = LINES.map((_, i) => setTimeout(() => setLineCount(i + 1), 350 + i * 380));
    const end = setTimeout(() => {
      setDone(true);
      markLoaded();
      document.documentElement.style.overflow = '';
    }, 350 + LINES.length * 380 + 420);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          data-testid="preloader"
          className="fixed inset-0 z-[95] flex items-center justify-center bg-bg"
          exit={{ y: '-100%', transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="absolute h-64 w-64 rounded-full bg-electric/20 blur-[90px] animate-pulse-glow" />
          <div className="relative font-mono text-sm md:text-base space-y-2 px-8">
            {LINES.slice(0, lineCount).map((l, i) => (
              <motion.p key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={i === LINES.length - 1 ? 'text-gradient font-semibold' : 'text-white/60'}>
                {l}
              </motion.p>
            ))}
            <div className="mt-4 h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-electric to-violett"
                initial={{ width: '0%' }}
                animate={{ width: `${(lineCount / LINES.length) * 100}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
