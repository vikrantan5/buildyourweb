'use client';

import { memo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Project } from '@/types/database';
import { cn } from '@/lib/utils';

function DeviceFrame({ project, children }: { project: Project; children: React.ReactNode }) {
  const isPhone = project.category === 'App';
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-panel/90',
        isPhone ? 'frame-phone aspect-[9/14] max-w-[240px] mx-auto' : 'frame-laptop aspect-[16/10] w-full'
      )}
    >
      {isPhone && <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-16 rounded-full bg-black/70 z-10" />}
      {children}
      <span className="absolute bottom-2 right-2 z-10 rounded-full bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white/80">
        {project.year}
      </span>
    </div>
  );
}

function ProjectCardBase({ project, className, size = 'md' }: { project: Project; className?: string; size?: 'md' | 'lg' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cycling, setCycling] = useState(false);
  const [frame, setFrame] = useState(0);
  const shots = [project.cover_url, ...(project.images ?? []).map((i) => i.url)].filter(Boolean) as string[];

  useEffect(() => {
    if (!cycling || shots.length < 2 || project.video_url) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % shots.length), 900);
    return () => clearInterval(t);
  }, [cycling, shots.length, project.video_url]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 10}deg) rotateX(${-py * 8}deg) translateZ(6px)`;
  };
  const onLeave = () => {
    setCycling(false);
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateY(0) rotateX(0)';
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setCycling(true)}
      onMouseLeave={onLeave}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      data-cursor="View"
      className={cn('group relative rounded-2xl p-2.5 glass transition-shadow hover:shadow-[0_20px_70px_rgba(14,165,255,0.18)]', className)}
      data-testid={`project-card-${project.slug}`}
    >
      <Link href={`/work/${project.slug}`} className="block" aria-label={`Open case study: ${project.title}`}>
        <DeviceFrame project={project}>
          {project.video_url && cycling ? (
            <video src={project.video_url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            shots.length > 0 && (
              <Image
                src={shots[cycling ? frame : 0]}
                alt={project.title}
                fill
                sizes={size === 'lg' ? '640px' : '420px'}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
          {project.featured && (
            <span className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold text-black">
              <Star size={10} fill="black" /> FEATURED
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <p className="font-display font-bold text-lg leading-tight">{project.title}</p>
            <p className="mt-0.5 text-xs text-white/60 line-clamp-2">{project.short_description}</p>
          </div>
        </DeviceFrame>
        <div className="flex items-center justify-between gap-2 px-1.5 pt-3 pb-1">
          <span className="rounded-full bg-electric/15 border border-electric/30 px-2.5 py-0.5 text-[11px] font-medium text-electric">
            {project.category}
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {project.tech_stack.slice(0, size === 'lg' ? 5 : 3).map((t) => (
              <span key={t} className="rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/55">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export const ProjectCard = memo(ProjectCardBase);
export default ProjectCard;
