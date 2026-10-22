'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Instagram, Loader2, Mail, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { submitInquiry } from '@/actions/inquiries';
import { inquirySchema, type InquiryFormValues } from '@/lib/validators';
import { PROJECT_TYPES, igLink, waLink } from '@/lib/utils';

export default function Contact({ settings }: { settings: { instagram: string; whatsapp: string; email: string } }) {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: '', contact: '', project_type: 'Website', message: '', website: '' },
  });

  const onSubmit = async (values: InquiryFormValues) => {
    const res = await submitInquiry(values);
    if (res.ok) {
      setSent(true);
      reset();
      toast.success('Message sent! I usually reply within a day.');
    } else {
      toast.error(res.error ?? 'Something went wrong.');
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute left-1/2 top-1/3 -z-10 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-violett/15 blur-[130px]" aria-hidden />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-electric">09 — Contact</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl font-bold tracking-tight">
            Tell me your <span className="text-gradient">idea</span>
          </h2>
          <p className="mt-4 max-w-md text-white/60">
            Fill the form or reach me directly — I reply personally, usually within a day.
          </p>
          <div className="mt-8 space-y-3" data-testid="contact-links">
            <a href={igLink(settings.instagram)} target="_blank" rel="noreferrer" data-cursor="Open"
              className="flex items-center gap-3 rounded-xl glass px-5 py-3.5 text-sm transition-all hover:bg-white/10">
              <Instagram size={18} className="text-electric" /> DM on Instagram <span className="ml-auto font-mono text-xs text-white/40">@{settings.instagram.replace('@', '')}</span>
            </a>
            <a href={waLink(settings.whatsapp)} target="_blank" rel="noreferrer" data-cursor="Open"
              className="flex items-center gap-3 rounded-xl glass px-5 py-3.5 text-sm transition-all hover:bg-white/10">
              <MessageCircle size={18} className="text-emerald-400" /> WhatsApp
            </a>
            <a href={`mailto:${settings.email}`} data-cursor="Open"
              className="flex items-center gap-3 rounded-xl glass px-5 py-3.5 text-sm transition-all hover:bg-white/10">
              <Mail size={18} className="text-violett" /> {settings.email}
            </a>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="contact-form"
          className="rounded-2xl glass p-6 md:p-8"
        >
          {/* honeypot — hidden from humans */}
          <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register('website')} className="hidden" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-white/60">Name</span>
              <input {...register('name')} data-testid="contact-name" placeholder="Your name"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition-colors focus:border-electric/60" />
              {errors.name && <span className="mt-1 block text-xs text-red-400">{errors.name.message}</span>}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-white/60">Email or phone</span>
              <input {...register('contact')} data-testid="contact-value" placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition-colors focus:border-electric/60" />
              {errors.contact && <span className="mt-1 block text-xs text-red-400">{errors.contact.message}</span>}
            </label>
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-white/60">Project type</span>
            <select {...register('project_type')} data-testid="contact-type"
              className="w-full rounded-lg border border-white/10 bg-panel px-4 py-3 text-sm outline-none focus:border-electric/60">
              {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-medium text-white/60">Message</span>
            <textarea {...register('message')} data-testid="contact-message" rows={5} placeholder="What are we building?"
              className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition-colors focus:border-electric/60" />
            {errors.message && <span className="mt-1 block text-xs text-red-400">{errors.message.message}</span>}
          </label>
          <button
            type="submit"
            disabled={isSubmitting || sent}
            data-testid="contact-submit"
            data-cursor="Open"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett py-3.5 font-semibold transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : sent ? 'Sent — talk soon!' : <><Send size={16} /> Send message</>}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
