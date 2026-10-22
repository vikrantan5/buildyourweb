'use client';

import dynamic from 'next/dynamic';

const Cursor = dynamic(() => import('./cursor'), { ssr: false });
const ScrollProgress = dynamic(() => import('./scroll-progress'), { ssr: false });
const SmoothScroll = dynamic(() => import('./smooth-scroll'), { ssr: false });
const EasterEgg = dynamic(() => import('./easter-egg'), { ssr: false });

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <SmoothScroll>{children}</SmoothScroll>
      <EasterEgg />
    </>
  );
}
