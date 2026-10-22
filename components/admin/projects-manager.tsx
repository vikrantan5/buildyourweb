'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  DndContext, PointerSensor, closestCenter, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, GripVertical, Loader2, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types/database';
import { bulkSetPublished, deleteProject, duplicateProject, reorderProjects, setProjectFlags } from '@/actions/projects';

function Row({
  project, onDelete, onDuplicate, onFlag, checked, onCheck,
}: {
  project: Project;
  onDelete: () => void;
  onDuplicate: () => void;
  onFlag: (flags: { featured?: boolean; published?: boolean }) => void;
  checked: boolean;
  onCheck: (v: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-testid={`project-row-${project.slug}`}
      className={`flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3 ${isDragging ? 'relative z-10 shadow-2xl ring-1 ring-electric/50' : ''}`}
    >
      <button {...attributes} {...listeners} data-cursor="Drag" aria-label="Drag to reorder" className="px-1 text-white/30 hover:text-white">
        <GripVertical size={17} />
      </button>
      <input type="checkbox" aria-label={`Select ${project.title}`} checked={checked} onChange={(e) => onCheck(e.target.checked)} className="h-4 w-4 accent-electric" />
      <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-white/5">
        {project.cover_url && <Image src={project.cover_url} alt="" fill sizes="64px" className="object-cover" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-display text-sm font-semibold">{project.title}</p>
          {project.featured && <Star size={12} className="shrink-0 text-amber-400" fill="currentColor" />}
        </div>
        <p className="truncate font-mono text-[11px] text-white/40">/work/{project.slug}</p>
      </div>
      <Badge variant="muted" className="hidden sm:inline-flex">{project.category}</Badge>
      <Badge variant={project.published ? 'success' : 'warning'} data-testid={`status-${project.slug}`}>
        {project.published ? 'Published' : 'Draft'}
      </Badge>
      <div className="flex items-center gap-1.5">
        <label className="flex items-center gap-1.5 text-[11px] text-white/50">
          <Switch checked={project.published} onCheckedChange={(v) => onFlag({ published: v })} data-testid={`publish-toggle-${project.slug}`} />
          Live
        </label>
        <button onClick={() => onFlag({ featured: !project.featured })} aria-label="Toggle featured" data-testid={`feature-star-${project.slug}`}
          className={project.featured ? 'text-amber-400' : 'text-white/30 hover:text-amber-300'}>
          <Star size={16} fill={project.featured ? 'currentColor' : 'none'} />
        </button>
        <Link href={`/admin/projects/${project.id}/edit`} data-testid={`edit-${project.slug}`} aria-label="Edit project" className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
          <Pencil size={15} />
        </Link>
        <button onClick={onDuplicate} aria-label="Duplicate project" data-testid={`duplicate-${project.slug}`} className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
          <Copy size={15} />
        </button>
        <button onClick={onDelete} aria-label="Delete project" data-testid={`delete-${project.slug}`} className="rounded-md p-1.5 text-white/50 hover:bg-red-500/15 hover:text-red-400">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    const supabase = createClient();
    supabase.from('projects').select('*').order('featured', { ascending: false }).order('sort_order')
      .then(({ data }) => setProjects((data as Project[]) ?? []));
  }, []);

  const visible = useMemo(
    () => (projects ?? []).filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.slug.includes(query.toLowerCase())),
    [projects, query]
  );

  const onDragEnd = (e: DragEndEvent) => {
    if (!projects || e.over?.id === e.active.id) return;
    const oldI = projects.findIndex((p) => p.id === e.active.id);
    const newI = projects.findIndex((p) => p.id === e.over!.id);
    const next = arrayMove(projects, oldI, newI);
    setProjects(next);
    toast.promise(reorderProjects(next.map((p) => p.id)), { success: 'Order saved', error: 'Reorder failed' });
  };

  const flag = async (p: Project, flags: { featured?: boolean; published?: boolean }) => {
    setProjects((ps) => (ps ?? []).map((x) => (x.id === p.id ? { ...x, ...flags } : x)));
    const res = await setProjectFlags(p.id, flags);
    if (!res.ok) toast.error(res.error);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Projects</h1>
          <p className="text-sm text-white/50">Drag rows to reorder — the site updates instantly.</p>
        </div>
        <Link href="/admin/projects/new" data-testid="add-project-btn"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett px-5 py-2.5 text-sm font-semibold">
          <Plus size={16} /> Add Project
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." data-testid="projects-search"
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm outline-none focus:border-electric/60" />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5" data-testid="bulk-bar">
            <span className="text-xs text-white/60">{selected.size} selected</span>
            <Button size="sm" variant="secondary" onClick={async () => {
              toast.promise(bulkSetPublished([...selected], true).then(() => setProjects((ps) => (ps ?? []).map((p) => (selected.has(p.id) ? { ...p, published: true } : p)))), { success: 'Published', error: 'Failed' });
              setSelected(new Set());
            }}>Publish</Button>
            <Button size="sm" variant="outline" onClick={async () => {
              toast.promise(bulkSetPublished([...selected], false).then(() => setProjects((ps) => (ps ?? []).map((p) => (selected.has(p.id) ? { ...p, published: false } : p)))), { success: 'Unpublished', error: 'Failed' });
              setSelected(new Set());
            }}>Unpublish</Button>
          </div>
        )}
      </div>

      {!projects ? (
        <div className="mt-8 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 skeleton" />)}</div>
      ) : visible.length === 0 ? (
        <div className="mt-10 rounded-2xl glass p-10 text-center">
          <p className="text-white/60">No projects yet. Click <strong>Add Project</strong> to showcase your first piece of work.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={visible.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="mt-6 space-y-3">
              {visible.map((p) => (
                <Row
                  key={p.id}
                  project={p}
                  checked={selected.has(p.id)}
                  onCheck={(v) => setSelected((s) => { const n = new Set(s); v ? n.add(p.id) : n.delete(p.id); return n; })}
                  onFlag={(f) => flag(p, f)}
                  onDuplicate={() => {
                    toast.promise(duplicateProject(p.id).then(() => setProjects(null)).then(() => {
                      const supabase = createClient();
                      return supabase.from('projects').select('*').order('featured', { ascending: false }).order('sort_order').then(({ data }) => setProjects((data as Project[]) ?? []));
                    }), { success: 'Duplicated', error: 'Duplicate failed' });
                  }}
                  onDelete={() => setPendingDelete(p)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete “{pendingDelete?.title}”?</DialogTitle>
            <DialogDescription>This permanently removes the project and its gallery images. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>Cancel</Button>
            <Button variant="destructive" data-testid="confirm-delete" onClick={async () => {
              const p = pendingDelete!;
              setPendingDelete(null);
              setProjects((ps) => (ps ?? []).filter((x) => x.id !== p.id));
              toast.promise(deleteProject(p.id), { success: 'Project deleted', error: 'Delete failed' });
            }}>
              <Trash2 size={15} /> Delete forever
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
