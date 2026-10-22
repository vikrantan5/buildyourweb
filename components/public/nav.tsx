"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="14" fill="#0A0C14" />
      <path
        d="M11 19 L21.5 45 L32 21"
        fill="none"
        stroke="#0EA5FF"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 21 L42.5 45 L53 19"
        fill="none"
        stroke="url(#lg-g)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="lg-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0EA5FF" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Nav({ available }: { available: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 140 && y > last && !open);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 inset-x-0 z-[60] transition-colors",
          scrolled ? "glass-strong border-b border-white/5" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 h-16">
          <a
            href="#top"
            data-cursor="Open"
            data-testid="nav-home"
            className="flex items-center gap-2.5"
          >
            <LogoMark size={30} />
            <span className="font-display font-bold tracking-tight text-lg">
              Build<span className="text-gradient">WithMe</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-7">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="Open"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
            {available && (
              <span className="flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available
              </span>
            )}
            <a
              href="#contact"
              data-cursor="Open"
              data-testid="nav-cta"
              className="rounded-full bg-gradient-to-r from-electric to-violett px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Start a Project
            </a>
          </div>
          <button
            aria-label="Toggle menu"
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen(!open)}
            className="md:hidden glass rounded-full p-2.5"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-bg/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-7 px-6"
          >
            {available && (
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-emerald-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for projects
              </motion.span>
            )}
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="font-display text-3xl font-bold text-white/90"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * LINKS.length }}
              className="mt-2 rounded-full bg-gradient-to-r from-electric to-violett px-8 py-3.5 text-sm font-semibold text-white"
            >
              Start a Project
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
