'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      data-testid="scroll-progress"
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[80] bg-gradient-to-r from-electric to-violett"
      style={{ scaleX }}
    />
  );
}
