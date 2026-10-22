'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function EasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let buffer = '';
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-5);
      if (buffer.endsWith('build')) {
        setActive(true);
        setTimeout(() => setActive(false), 3200);
        buffer = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-testid="light-show"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center"
        >
          <div className="lightshow" />
          <p className="relative font-display text-6xl md:text-8xl font-bold text-gradient drop-shadow-[0_0_30px_rgba(14,165,255,.7)]">
            BUILD MODE
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
