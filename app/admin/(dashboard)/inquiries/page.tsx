'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Download, Loader2, Search, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import type { Inquiry, InquiryStatus } from '@/types/database';
import { deleteInquiry, exportInquiriesCsv, setInquiryStatus } from '@/actions/inquiries';
import { formatDate } from '@/lib/utils';

const STATUS_VARIANT: Record<InquiryStatus, 'warning' | 'violet' | 'muted'> = { new: 'warning', replied: 'violet', closed: 'muted' };

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Inquiry | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(1000)
      .then(({ data }) => setInquiries((data as Inquiry[]) ?? []));
  }, []);

  const visible = useMemo(
    () => (inquiries ?? []).filter((i) =>
      [i.name, i.contact, i.project_type, i.message].some((f) => (f ?? '').toLowerCase().includes(query.toLowerCase()))),
    [inquiries, query]
  );

  const setStatus = async (i: Inquiry, status: InquiryStatus) => {
    setInquiries((rows) => (rows ?? []).map((r) => (r.id === i.id ? { ...r, status } : r)));
    await toast.promise(setInquiryStatus(i.id, status), { success: 'Status updated', error: 'Failed' });
  };

  const downloadCsv = async () => {
    try {
      const csv = await exportInquiriesCsv();
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Inquiries</h1>
          <p className="text-sm text-white/50">Contact form submissions land here.</p>
        </div>
        <button onClick={downloadCsv} data-testid="export-csv"
          className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm hover:bg-white/5">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search inquiries..." data-testid="inquiries-search"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-electric/60" />
      </div>

      {!inquiries ? (
        <div className="mt-8 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton" />)}</div>
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-2xl glass p-10 text-center text-white/60">
          No inquiries yet — they&apos;ll appear here when someone submits the contact form.
        </div>
      ) : (
        <ul className="mt-6 space-y-3" data-testid="inquiries-list">
          {visible.map((i) => (
            <li key={i.id} data-testid={`inquiry-${i.id}`} className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-medium">{i.name}</p>
                <Badge variant={STATUS_VARIANT[i.status]}>{i.status}</Badge>
                <span className="font-mono text-[11px] text-white/40">{formatDate(i.created_at)}</span>
                <div className="ml-auto flex items-center gap-2">
                  <select value={i.status} onChange={(e) => setStatus(i, e.target.value as InquiryStatus)} aria-label="Status" data-testid={`inquiry-status-${i.id}`}
                    className="rounded-lg border border-white/10 bg-panel px-2.5 py-1.5 text-xs outline-none focus:border-electric/60">
                    {(['new', 'replied', 'closed'] as const).map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setPendingDelete(i)} aria-label="Delete inquiry" data-testid={`inquiry-delete-${i.id}`}
                    className="rounded-md p-1.5 text-white/50 hover:bg-red-500/15 hover:text-red-400"><Trash2 size={15} /></button>
                </div>
              </div>
              <p className="mt-2 text-sm text-electric">{i.contact} · {i.project_type}</p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-white/65">{i.message}</p>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete inquiry from {pendingDelete?.name}?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <button className="rounded-full border border-white/15 px-5 py-2 text-sm" onClick={() => setPendingDelete(null)}>Cancel</button>
            <button data-testid="confirm-delete-inquiry" className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold"
              onClick={async () => {
                const i = pendingDelete!;
                setPendingDelete(null);
                setInquiries((rows) => (rows ?? []).filter((r) => r.id !== i.id));
                await toast.promise(deleteInquiry(i.id), { success: 'Deleted', error: 'Failed' });
              }}>Delete</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
