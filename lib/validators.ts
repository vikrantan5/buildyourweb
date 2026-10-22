import { z } from 'zod';
import { CATEGORIES } from '@/lib/utils';

export const projectSchema = z.object({
  title: z.string().min(3, 'Title needs at least 3 characters').max(120),
  slug: z
    .string()
    .min(3)
    .max(140)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and dashes only'),
  short_description: z.string().min(10, 'Write at least 10 characters').max(300),
  category: z.enum(CATEGORIES),
  year: z.coerce.number().int().min(2015).max(2100),
  client_name: z.string().max(120).optional().or(z.literal('')),
  role: z.string().max(120).optional().or(z.literal('')),
  overview: z.string().max(4000).optional().or(z.literal('')),
  problem: z.string().max(4000).optional().or(z.literal('')),
  solution: z.string().max(4000).optional().or(z.literal('')),
  key_features: z.array(z.string().min(2).max(120)).max(12).default([]),
  tech_stack: z.array(z.string().min(1).max(60)).max(30).default([]),
  live_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  github_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  results: z.string().max(1000).optional().or(z.literal('')),
  cover_url: z.string().max(600).optional().or(z.literal('')),
  video_url: z.string().max(600).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});
export type ProjectFormValues = z.input<typeof projectSchema>;

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name is too short').max(120),
  contact: z
    .string()
    .min(5, 'How do I reach you?')
    .max(160)
    .refine((v) => /.+@.+\..+/.test(v) || /^[+\d][\d\s-]{6,}$/.test(v), 'Enter a valid email or phone'),
  project_type: z.string().min(2).max(80),
  message: z.string().min(10, 'Tell me a bit more').max(2000),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot — must stay empty
});
export type InquiryFormValues = z.infer<typeof inquirySchema>;

export const settingsSchema = z.object({
  hero_title: z.string().min(3).max(160),
  hero_subtitle: z.string().min(3).max(400),
  hero_badge: z.string().min(2).max(80),
  tagline: z.string().min(2).max(80),
  subline: z.string().min(2).max(80),
  about_title: z.string().min(2).max(120),
  about_text: z.string().min(10).max(4000),
  instagram: z.string().max(80),
  whatsapp: z.string().max(30),
  email: z.string().max(160),
  seo_title: z.string().max(160),
  seo_description: z.string().max(400),
  og_image: z.string().max(600).optional().or(z.literal('')),
  available_for_work: z.boolean(),
});
