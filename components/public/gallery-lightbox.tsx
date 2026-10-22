'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function GalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % images.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, images.length]);

  if (!images.length) return null;
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" data-testid="project-gallery">
        {images.map((src, i) => (
          <motion.button
            key={src + i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: (i % 2) * 0.07 }}
            onClick={() => setOpen(i)}
            data-cursor="Open"
            aria-label={`Open screenshot ${i + 1} of ${title}`}
            className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-panel"
          >
            <Image src={src} alt={`${title} screenshot ${i + 1}`} fill sizes="(max-width: 640px) 100vw, 600px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-12"
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} screenshot viewer`}
            data-testid="lightbox"
          >
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-5 top-5 rounded-full glass p-3">
              <X size={20} />
            </button>
            {images.length > 1 && (
              <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + images.length) % images.length); }}
                className="absolute left-4 md:left-8 rounded-full glass p-3 hover:bg-white/10"><ChevronLeft size={22} /></button>
            )}
            <motion.div
              key={open}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-full w-full max-w-5xl overflow-hidden rounded-xl"
            >
              <Image src={images[open]} alt={`${title} screenshot ${open + 1}`} fill sizes="1000px" className="object-contain" />
            </motion.div>
            {images.length > 1 && (
              <button aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % images.length); }}
                className="absolute right-4 md:right-8 rounded-full glass p-3 hover:bg-white/10"><ChevronRight size={22} /></button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
