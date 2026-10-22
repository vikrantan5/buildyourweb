import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { LogoMark } from './nav';
import { igLink, waLink } from '@/lib/utils';

export default function Footer({ settings }: { settings: { tagline: string; subline: string; instagram: string; whatsapp: string; email: string } }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-5 md:flex-row md:px-8">
        <div className="flex items-center gap-3">
          <LogoMark size={30} />
          <div>
            <p className="font-display font-bold">Build<span className="text-gradient">WithMe</span></p>
            <p className="font-mono text-[11px] text-white/40">{settings.tagline} // {settings.subline}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={igLink(settings.instagram)} target="_blank" rel="noreferrer" aria-label="Instagram" data-cursor="Open"
            className="rounded-full glass p-3 transition-all hover:bg-white/10"><Instagram size={17} /></a>
          <a href={waLink(settings.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" data-cursor="Open"
            className="rounded-full glass p-3 transition-all hover:bg-white/10"><MessageCircle size={17} /></a>
          <a href={`mailto:${settings.email}`} aria-label="Email" data-cursor="Open"
            className="rounded-full glass p-3 transition-all hover:bg-white/10"><Mail size={17} /></a>
        </div>
        <p className="text-xs text-white/35">© {year} BuildWithMe. Ideas → Code → Reality.</p>
      </div>
    </footer>
  );
}
