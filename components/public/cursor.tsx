'use client';

import { useEffect, useRef, useState } from 'react';

const LABELS = { View: 'View', Drag: 'Drag', Open: 'Open' } as const;
export type CursorLabel = keyof typeof LABELS;

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<CursorLabel | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add('custom-cursor');

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      const target = (e.target as HTMLElement)?.closest?.('[data-cursor]');
      setLabel(target ? ((target.getAttribute('data-cursor') as CursorLabel) || null) : null);
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx - 22}px, ${ry - 22}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('custom-cursor');
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={dot} aria-hidden className="fixed top-0 left-0 z-[100] w-1.5 h-1.5 rounded-full bg-electric pointer-events-none" />
      <div
        ref={ring}
        aria-hidden
        data-testid="custom-cursor"
        className={`fixed top-0 left-0 z-[99] h-11 w-11 rounded-full pointer-events-none flex items-center justify-center transition-all duration-200 ${
          label ? 'bg-electric/90 scale-100' : 'border border-electric/60 scale-90 bg-transparent'
        }`}
        style={{ boxShadow: label ? '0 0 24px rgba(14,165,255,.6)' : '0 0 18px rgba(14,165,255,.25)' }}
      >
        {label && <span className="font-mono text-[10px] font-semibold text-white">{LABELS[label]}</span>}
      </div>
    </>
  );
}
