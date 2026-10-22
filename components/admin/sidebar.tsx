'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Briefcase, HelpCircle, Inbox, LayoutDashboard, Layers, LogOut, Menu, Settings, Smartphone, Sparkles, Users, Wrench, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { signOutAction } from '@/actions/auth';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/tech-stack', label: 'Tech Stack', icon: Layers },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Users },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/stats', label: 'Stats', icon: BarChart3 },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
  { href: '/admin/media', label: 'Media Library', icon: Smartphone },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    toast.promise(signOutAction(), { loading: 'Signing out...', success: 'Signed out', error: 'Failed' });
  };

  return (
    <>
      <button
        className="fixed left-4 top-4 z-[70] rounded-xl glass-strong p-2.5 lg:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle admin menu"
        data-testid="admin-menu-toggle"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside
        data-testid="admin-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-[65] flex w-64 flex-col border-r border-white/8 bg-panel/95 backdrop-blur-xl transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-violett font-display text-lg font-bold">W</span>
          <div>
            <p className="font-display text-sm font-bold">BuildWithMe</p>
            <p className="font-mono text-[10px] text-white/40">admin panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              data-testid={`admin-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors',
                pathname === href ? 'bg-electric/15 text-electric font-semibold' : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/8 p-4">
          <p className="truncate px-1 font-mono text-[11px] text-white/40">{email}</p>
          <a href="/" target="_blank" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/5 hover:text-white">
            <ExternalLink size={14} /> View live site
          </a>
          <button onClick={logout} data-testid="admin-logout"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 hover:bg-red-500/10">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-[64] bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
