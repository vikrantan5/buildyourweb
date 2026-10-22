export type Category = 'Website' | 'App' | 'UI/UX' | 'AI' | 'E-commerce' | 'Other';

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  sort_order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: Category;
  year: number;
  client_name: string | null;
  role: string | null;
  overview: string | null;
  problem: string | null;
  solution: string | null;
  key_features: string[];
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  results: string | null;
  cover_url: string | null;
  video_url: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at?: string;
  images?: ProjectImage[];
}

export interface TechStackItem {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  visible: boolean;
  sort_order: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  icon: string;
  visible: boolean;
  sort_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar_url: string | null;
  visible: boolean;
  sort_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  visible: boolean;
  sort_order: number;
}

export interface Stat {
  id: string;
  label: string;
  value: number;
  suffix: string | null;
  visible: boolean;
  sort_order: number;
}

export interface SiteSettings {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  tagline: string;
  subline: string;
  about_title: string;
  about_text: string;
  instagram: string;
  whatsapp: string;
  email: string;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
  available_for_work: boolean;
}

export type InquiryStatus = 'new' | 'replied' | 'closed';

export interface Inquiry {
  id: string;
  name: string;
  contact: string;
  project_type: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}
