'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import { deleteRecord, reorderRecords, toggleVisible, upsertRecord } from '@/actions/content';

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'switch' | 'list';
  placeholder?: string;
}

type Row = Record<string, unknown> & { id: string };

export default function CrudManager({
  table, title, hint, fields, defaults, titleKey,
}: {
  table: string;
  title: string;
  hint?: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  titleKey: string;
}) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>(defaults);
  const [listDraft, setListDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    const supabase = createClient();
    supabase.from(table).select('*').order('sort_order').then(({ data }) => setRows((data as Row[]) ?? []));
  };
  useEffect(load, [table]);

  const openNew = () => { setEditing(null); setForm({ ...defaults }); setOpen(true); };
  const openEdit = (row: Row) => { setEditing(row); setForm({ ...row }); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      await toast.promise(upsertRecord(table, form), { success: 'Saved — site refreshed', error: 'Save failed' });
      setOpen(false);
      load();
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    setRows((r) => (r ?? []).filter((x) => x.id !== id));
    await toast.promise(deleteRecord(table, id), { success: 'Deleted', error: 'Delete failed' });
    load();
  };

  const move = async (row: Row, dir: -1 | 1) => {
    if (!rows) return;
    const i = rows.findIndex((r) => r.id === row.id);
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    await toast.promise(reorderRecords(table, next.map((r) => r.id)), { success: 'Order saved', error: 'Reorder failed' });
  };

  const renderField = (f: FieldDef) => {
    const value = form[f.name];
    if (f.type === 'switch') {
      return (
        <label key={f.name} className="flex items-center gap-2 text-sm">
          <Switch checked={!!value} onCheckedChange={(v) => setForm({ ...form, [f.name]: v })} data-testid={`field-${f.name}`} />
          {f.label}
        </label>
      );
    }
    if (f.type === 'textarea') {
      return (
        <label key={f.name} className="block">
          <Label className="mb-1.5 block">{f.label}</Label>
          <textarea rows={3} data-testid={`field-${f.name}`} value={String(value ?? '')} placeholder={f.placeholder}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-electric/60" />
        </label>
      );
    }
    if (f.type === 'list') {
      const items = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div key={f.name}>
          <Label className="mb-1.5 block">{f.label}</Label>
          <div className="flex gap-2">
            <Input value={listDraft} onChange={(e) => setListDraft(e.target.value)} placeholder="Add item + Enter" data-testid={`field-${f.name}-input`}
              onKeyDown={(e) => { if (e.key === 'Enter' && listDraft.trim()) { e.preventDefault(); setForm({ ...form, [f.name]: [...items, listDraft.trim()] }); setListDraft(''); } }} />
            <button type="button" onClick={() => { if (listDraft.trim()) { setForm({ ...form, [f.name]: [...items, listDraft.trim()] }); setListDraft(''); } }}
              className="rounded-lg bg-white/10 px-3 hover:bg-white/20">Add</button>
          </div>
          <ul className="mt-2 space-y-1">
            {items.map((it, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm">
                {it}
                <button type="button" onClick={() => setForm({ ...form, [f.name]: items.filter((_, j) => j !== i) })} className="text-red-400"><Trash2 size={13} /></button>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <label key={f.name} className="block">
        <Label className="mb-1.5 block">{f.label}</Label>
        <Input type={f.type === 'number' ? 'number' : 'text'} data-testid={`field-${f.name}`} value={String(value ?? '')}
          placeholder={f.placeholder} onChange={(e) => setForm({ ...form, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })} />
      </label>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {hint && <p className="text-sm text-white/50">{hint}</p>}
        </div>
        <button onClick={openNew} data-testid="crud-add"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett px-5 py-2.5 text-sm font-semibold">
          <Plus size={16} /> Add
        </button>
      </div>

      {!rows ? (
        <div className="mt-8 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 skeleton" />)}</div>
      ) : rows.length === 0 ? (
        <div className="mt-10 rounded-2xl glass p-10 text-center text-white/60">Nothing here yet — add your first entry.</div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((row) => (
            <li key={row.id} data-testid={`crud-row-${String(row.id)}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{String(row[titleKey] ?? 'Untitled')}</p>
                {row.price ? <p className="text-xs text-electric">{String(row.price)}</p> : null}
                {row.question ? <p className="truncate text-xs text-white/40">{String(row.answer ?? '')}</p> : null}
                {row.name && row.quote ? <p className="truncate text-xs text-white/40">{String(row.quote)}</p> : null}
              </div>
              <label className="flex items-center gap-1.5 text-[11px] text-white/50">
                <Switch checked={!!row.visible} onCheckedChange={(v) => toast.promise(toggleVisible(table, row.id, v), { success: 'Updated', error: 'Failed' })} />
                Visible
              </label>
              <div className="flex items-center gap-1">
                <button onClick={() => move(row, -1)} aria-label="Move up" className="rounded-md p-1.5 text-white/50 hover:bg-white/10"><ArrowUp size={14} /></button>
                <button onClick={() => move(row, 1)} aria-label="Move down" className="rounded-md p-1.5 text-white/50 hover:bg-white/10"><ArrowDown size={14} /></button>
                <button onClick={() => openEdit(row)} aria-label="Edit" data-testid={`crud-edit-${row.id}`} className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"><Pencil size={14} /></button>
                <button onClick={() => remove(row.id)} aria-label="Delete" data-testid={`crud-delete-${row.id}`} className="rounded-md p-1.5 text-white/50 hover:bg-red-500/15 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} — {title}</DialogTitle>
            <DialogDescription>Changes go live on the public site instantly.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">{fields.map(renderField)}</div>
          <div className="mt-5 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} data-testid="crud-save">
              {saving ? <Loader2 size={15} className="animate-spin" /> : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
