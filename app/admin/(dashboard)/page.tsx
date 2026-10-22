'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Inbox, Loader2, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [counts, setCounts] = useState<{ projects?: number; drafts?: number; inquiries?: number } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const [projects, drafts, inquiries] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('published', false),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ]);
      setCounts({
        projects: projects.count ?? 0,
        drafts: drafts.count ?? 0,
        inquiries: inquiries.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: 'Total projects', value: counts?.projects, href: '/admin/projects', icon: Briefcase },
    { label: 'Drafts', value: counts?.drafts, href: '/admin/projects', icon: Briefcase },
    { label: 'New inquiries', value: counts?.inquiries, href: '/admin/inquiries', icon: Inbox },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-white/50">Everything on your site, editable here.</p>
        </div>
        <Link href="/admin/projects/new" data-testid="dashboard-add-project"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett px-5 py-2.5 text-sm font-semibold">
          <Plus size={16} /> Add Project
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3" data-testid="dashboard-cards">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="rounded-2xl glass p-6 transition-colors hover:bg-white/[0.07]">
            <Icon size={18} className="text-electric" />
            <p className="mt-4 font-display text-3xl font-bold" data-testid={`dashboard-count-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {counts ? (value ?? 0) : <Loader2 size={20} className="animate-spin text-white/40" />}
            </p>
            <p className="mt-1 text-xs text-white/50">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
