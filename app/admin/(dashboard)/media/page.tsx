'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { deleteMedia } from '@/actions/media';

interface FileRow { name: string; path: string; url: string; size: number; updated: string }

export default function MediaPage() {
  const [files, setFiles] = useState<FileRow[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FileRow | null>(null);

  const load = () => {
    const supabase = createClient();
    supabase.storage.from('portfolio-media').list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })
      .then(({ data, error }) => {
        if (error) { toast.error(error.message); setFiles([]); return; }
        const rows: FileRow[] = [];
        for (const f of data ?? []) {
          if (!f.id) continue; // skip folder entries
          const path = f.name.includes('/') ? f.name : f.name;
          rows.push({
            name: f.name,
            path: path,
            url: supabase.storage.from('portfolio-media').getPublicUrl(path).data.publicUrl,
            size: f.metadata?.size ?? 0,
            updated: f.updated_at ?? '',
          });
        }
        setFiles(rows);
      });
  };
  useEffect(load, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Media Library</h1>
      <p className="text-sm text-white/50">All uploads live in the portfolio-media bucket. Deleting removes them from the live site.</p>

      {!files ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">{[...Array(4)].map((_, i) => <div key={i} className="aspect-square skeleton" />)}</div>
      ) : files.length === 0 ? (
        <div className="mt-10 rounded-2xl glass p-10 text-center text-white/60">
          No files yet. Uploads from projects and settings appear here.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="media-grid">
          {files.map((f) => (
            <div key={f.path} data-testid={`media-file-${f.name}`} className="group overflow-hidden rounded-xl border border-white/8 bg-white/[0.03]">
              <div className="relative aspect-video bg-black/40">
                {/\.(jpg|jpeg|png|webp|gif)$/i.test(f.name) ? (
                  <Image src={f.url} alt={f.name} fill sizes="300px" className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-xs text-white/40">video</div>
                )}
                <button onClick={() => setPendingDelete(f)} aria-label={`Delete ${f.name}`} data-testid={`media-delete-${f.name}`}
                  className="absolute right-2 top-2 rounded-lg bg-black/70 p-1.5 text-red-300 opacity-0 transition-opacity group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-2.5">
                <p className="truncate text-[11px] text-white/70">{f.name}</p>
                <p className="font-mono text-[10px] text-white/35">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete file?</DialogTitle>
            <DialogDescription>“{pendingDelete?.name}” will be removed from storage. Pages using it may lose the image.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <button className="rounded-full border border-white/15 px-5 py-2 text-sm" onClick={() => setPendingDelete(null)}>Cancel</button>
            <button data-testid="confirm-delete-media" className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold"
              onClick={async () => {
                const f = pendingDelete!;
                setPendingDelete(null);
                setFiles((fs) => (fs ?? []).filter((x) => x.path !== f.path));
                await toast.promise(deleteMedia([f.path]), { success: 'File deleted', error: 'Delete failed' });
                load();
              }}>Delete</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
