'use client';

import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import type { Faq } from '@/types/database';

export default function Faq({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-[0.35em] text-electric">08 — FAQ</p>
        <h2 className="mt-3 text-center font-display text-3xl md:text-5xl font-bold tracking-tight">
          Questions, <span className="text-gradient">answered</span>
        </h2>
        <Accordion type="single" collapsible className="mt-12" data-testid="faq-accordion">
          {items.map((f, i) => (
            <AccordionItem key={f.id} value={f.id} className="border-white/8">
              <AccordionTrigger className="text-left font-display text-base md:text-lg hover:text-electric hover:no-underline">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-white/60">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
