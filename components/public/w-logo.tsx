'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const WLogo3D = dynamic(() => import('./w-logo-3d'), { ssr: false });

function FallbackW() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span
        className="font-display text-[11rem] md:text-[16rem] font-bold leading-none text-gradient select-none animate-float"
        style={{ filter: 'drop-shadow(0 0 45px rgba(14,165,255,.45))' }}
        aria-hidden
      >
        W
      </span>
    </div>
  );
}

export default function WLogo() {
  const [allow3D, setAllow3D] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.deviceMemory && nav.deviceMemory <= 4) || (navigator.hardwareConcurrency || 8) <= 4;
    setAllow3D(!reduced && !weak);
  }, []);

  if (!mounted) return <div className="h-full w-full" />;
  return allow3D ? <WLogo3D /> : <FallbackW />;
}
