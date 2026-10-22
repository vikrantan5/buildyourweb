'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types/database';
import { cn } from '@/lib/utils';

function ShowcaseCard({ project, i }: { project: Project; i: number }) {
  const [cycling, setCycling] = useState(0);
  const isPhone = project.category === 'App';
  const shots = [project.cover_url, ...(project.images ?? []).map((im) => im.url)].filter(Boolean) as string[];

  useEffect(() => {
    if (shots.length < 2) return;
    const t = setInterval(() => setCycling((c) => (c + 1) % shots.length), 1600);
    return () => clearInterval(t);
  }, [shots.length]);

  return (
    <div
      className={cn('showcase-card group relative shrink-0 px-3 md:px-6', i % 2 === 0 ? 'md:mt-16' : 'md:-mt-6')}
      style={{ width: '78vw', maxWidth: 560 }}
    >
      <Link
        href={`/work/${project.slug}`}
        data-cursor="View"
        data-testid={`showcase-card-${project.slug}`}
        className="block rounded-2xl p-2.5 glass transition-shadow hover:shadow-[0_30px_90px_rgba(14,165,255,0.22)]"
      >
        <div
          className={cn(
            'relative overflow-hidden',
            isPhone ? 'frame-phone mx-auto aspect-[9/14] max-w-[220px]' : 'frame-laptop aspect-[16/10] w-full'
          )}
        >
          {project.video_url ? (
            <video src={project.video_url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            shots.length > 0 && (
              <Image
                key={cycling}
                src={shots[cycling]}
                alt={project.title}
                fill
                sizes="560px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                priority={i === 0}
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-electric">
              <span className="rounded-full bg-electric/15 border border-electric/30 px-2 py-0.5">{project.category}</span>
              <span className="font-mono text-white/50">{project.year}</span>
            </div>
            <h3 className="mt-2 font-display text-2xl font-bold">{project.title}</h3>
            <p className="mt-1 text-sm text-white/60 line-clamp-2">{project.short_description}</p>
          </div>
          <span className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function ShowcaseView({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const rq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setIsMobile(mq.matches); setReduced(rq.matches); };
    update();
    mq.addEventListener('change', update);
    rq.addEventListener('change', update);
    return () => { mq.removeEventListener('change', update); rq.removeEventListener('change', update); };
  }, []);

  useLayoutEffect(() => {
    if (isMobile || reduced || !trackRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
      gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getDistance() * 1.1}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      gsap.utils.toArray<HTMLElement>('.showcase-card').forEach((card, i) => {
        gsap.fromTo(card, { y: i % 2 ? 70 : -50 }, {
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'top top', scrub: 1 },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [projects, isMobile, reduced]);

  if (isMobile || reduced) {
    return (
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:px-8 pb-4" data-testid="showcase-scroll">
        {projects.map((p, i) => (
          <div key={p.id} className="snap-center shrink-0" style={{ width: '82vw', maxWidth: 420 }}>
            <ShowcaseCard project={p} i={i} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative overflow-hidden" data-testid="showcase-pinned">
      <div className="pointer-events-none absolute top-1/2 left-0 font-display text-[22vw] font-bold leading-none text-white/[0.025] select-none">
        WORK
      </div>
      <div ref={trackRef} className="flex w-max items-center px-8 py-10">
        {projects.map((p, i) => (
          <ShowcaseCard key={p.id} project={p} i={i} />
        ))}
        <div className="flex w-[46vw] shrink-0 flex-col items-start gap-4 px-6">
          <p className="font-display text-3xl font-bold">
            Like what you <span className="text-gradient">see?</span>
          </p>
          <p className="max-w-xs text-white/55">Every project here started as an idea in someone&apos;s head. Yours could be next.</p>
          <a href="#contact" data-cursor="Open" className="rounded-full bg-gradient-to-r from-electric to-violett px-6 py-3 font-semibold transition-transform hover:scale-105">
            Let&apos;s build yours
          </a>
        </div>
      </div>
      <div className="mx-auto mt-4 h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
        <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-electric to-violett" />
      </div>
    </div>
  );
}
