import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Chrome } from '@/components/public/chrome';
import { getSettings } from '@/lib/data';
import './globals.css';

const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jet = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jet', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seo_title || `${'BuildWithMe'} — ${s.tagline}`, template: '%s — BuildWithMe' },
    description: s.seo_description || s.hero_subtitle,
    keywords: ['freelance developer', 'web development', 'app development', 'UI/UX', 'AI solutions', 'BuildWithMe'],
    openGraph: {
      title: s.seo_title || 'BuildWithMe — Webs • Apps • And More',
      description: s.seo_description,
      url: siteUrl,
      siteName: 'BuildWithMe',
      type: 'website',
      images: [{ url: s.og_image || '/logo.png' }],
    },
    twitter: { card: 'summary_large_image', title: s.seo_title, description: s.seo_description },
    icons: { icon: '/icon.svg' },
  };
}

export const viewport: Viewport = { themeColor: '#05060A' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${space.variable} ${inter.variable} ${jet.variable} font-body bg-bg text-white antialiased grain`}>
        <Chrome>{children}</Chrome>
        <Toaster theme="dark" position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
