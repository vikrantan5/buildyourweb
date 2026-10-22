import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORIES = ['Website', 'App', 'UI/UX', 'AI', 'E-commerce', 'Other'] as const;
export const PROJECT_TYPES = ['Website', 'E-commerce', 'Mobile App', 'UI/UX Design', 'AI Solution', 'Other'] as const;

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

export function waLink(num: string) {
  return `https://wa.me/${(num || '').replace(/\D/g, '')}`;
}

export function igLink(handle: string) {
  return `https://instagram.com/${(handle || '').replace(/^@/, '')}`;
}

export function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
