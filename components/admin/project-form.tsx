'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeft, GripVertical, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MediaUploader from './media-uploader';
import ProjectCard from '@/components/public/project-card';
import { projectSchema, type ProjectFormValues } from '@/lib/validators';
import { CATEGORIES, slugify } from '@/lib/utils';
import type { Project, ProjectImage } from '@/types/database';
import { setProjectImages, upsertProject } from '@/actions/projects';

function GalleryItem({ url, onRemove }: { url: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 ${isDragging ? 'z-10 ring-2 ring-electric' : ''}`}>
      <Image src={url} alt="gallery" fill sizes="128px" className="object-cover" />
      <button type="button" {...attributes} {...listeners} aria-label="Drag to reorder" data-cursor="Drag"
        className="absolute left-1 top-1 rounded bg-black/60 p-1 text-white/80 hover:text-white">
        <GripVertical size={12} />
      </button>
      <button type="button" onClick={onRemove} aria-label="Remove image"
        className="absolute right-1 top-1 rounded bg-black/60 p-1 text-red-300 hover:text-red-200">
        <X size={12} />
      </button>
    </div>
  );
}

export default function ProjectForm({ initial, techOptions }: { initial?: Project & { images?: ProjectImage[] }; techOptions: string[] }) {
  const router = useRouter();
  const [features, setFeatures] = useState<string[]>(initial?.key_features ?? []);
  const [featureDraft, setFeatureDraft] = useState('');
  const [tech, setTech] = useState<string[]>(initial?.tech_stack ?? []);
  const [techDraft, setTechDraft] = useState('');
  const [allTech, setAllTech] = useState<string[]>(techOptions);
  const [gallery, setGallery] = useState<string[]>((initial?.images ?? []).map((i) => i.url));
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      short_description: initial?.short_description ?? '',
      category: initial?.category ?? 'Website',
      year: initial?.year ?? new Date().getFullYear(),
      client_name: initial?.client_name ?? '',
      role: initial?.role ?? '',
      overview: initial?.overview ?? '',
      problem: initial?.problem ?? '',
      solution: initial?.solution ?? '',
      results: initial?.results ?? '',
      live_url: initial?.live_url ?? '',
      github_url: initial?.github_url ?? '',
      cover_url: initial?.cover_url ?? '',
      video_url: initial?.video_url ?? '',
      featured: initial?.featured ?? false,
      published: initial?.published ?? false,
      key_features: [],
      tech_stack: [],
    },
  });

  useEffect(() => { setValue('key_features', features); }, [features, setValue]);
  useEffect(() => { setValue('tech_stack', tech); }, [tech, setValue]);

  const values = watch();
  const title = values.title ?? '';

  useEffect(() => {
    if (!slugTouched && title) setValue('slug', slugify(title));
  }, [title, slugTouched, setValue]);

  const preview: Project = {
    id: 'preview', slug: values.slug || 'preview', title: values.title || 'Untitled project',
    short_description: values.short_description || 'A short description appears here.',
    category: values.category ?? 'Website', year: Number(values.year) || new Date().getFullYear(),
    client_name: values.client_name || null, role: values.role || null, overview: values.overview || null,
    problem: values.problem || null, solution: values.solution || null, key_features: features,
    tech_stack: tech, live_url: values.live_url || null, github_url: values.github_url || null,
    results: values.results || null, cover_url: values.cover_url || null, video_url: values.video_url || null,
    featured: !!values.featured, published: !!values.published, sort_order: 0,
  };

  const onSubmit = async (v: ProjectFormValues) => {
    setSaving(true);
    try {
      const res = await upsertProject({ ...v, id: initial?.id });
      if (!res.ok) { toast.error(res.error); return; }
      if (res.id) await setProjectImages(res.id, gallery);
      toast.success(initial?.id ? 'Project updated — site refreshed.' : 'Project saved — site refreshed.');
      router.push('/admin/projects');
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const err = (m?: string) => m && <span className="mt-1 block text-xs text-red-400">{m}</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="project-form" className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white">
          <ArrowLeft size={14} /> Back to projects
        </Link>
        <h1 className="font-display text-2xl font-bold">{initial ? 'Edit project' : 'Add project'}</h1>

        <Tabs defaultValue="content">
          <TabsList className="flex-wrap">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="links">Links & Meta</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <Label className="mb-1.5 block">Title *</Label>
                <Input data-testid="form-title" {...register('title')} placeholder="NovaCart" />
                {err(errors.title?.message)}
              </label>
              <label className="block">
                <Label className="mb-1.5 block">Slug (URL) *</Label>
                <Input data-testid="form-slug" {...register('slug')} onChange={(e) => { setSlugTouched(true); register('slug').onChange(e); }} placeholder="novacart" />
                {err(errors.slug?.message)}
              </label>
              <label className="block">
                <Label className="mb-1.5 block">Category *</Label>
                <select data-testid="form-category" {...register('category')}
                  className="h-10 w-full rounded-lg border border-white/10 bg-panel px-3 text-sm outline-none focus:border-electric/60">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="block">
                <Label className="mb-1.5 block">Year *</Label>
                <Input type="number" data-testid="form-year" {...register('year')} />
                {err(errors.year?.message)}
              </label>
              <label className="block">
                <Label className="mb-1.5 block">Client name (optional)</Label>
                <Input data-testid="form-client" {...register('client_name')} placeholder="Acme Inc." />
              </label>
              <label className="block">
                <Label className="mb-1.5 block">My role</Label>
                <Input data-testid="form-role" {...register('role')} placeholder="Design + Development" />
              </label>
            </div>
            <label className="block">
              <Label className="mb-1.5 block">Short description * (shown on cards)</Label>
              <Input data-testid="form-short" {...register('short_description')} placeholder="One sentence that sells the project" />
              {err(errors.short_description?.message)}
            </label>
            <label className="block">
              <Label className="mb-1.5 block">Overview</Label>
              <textarea data-testid="form-overview" rows={3} {...register('overview')}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-electric/60" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <Label className="mb-1.5 block">Problem</Label>
                <textarea data-testid="form-problem" rows={4} {...register('problem')}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-electric/60" />
              </label>
              <label className="block">
                <Label className="mb-1.5 block">Solution</Label>
                <textarea data-testid="form-solution" rows={4} {...register('solution')}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-electric/60" />
              </label>
            </div>

            <div>
              <Label className="mb-1.5 block">Key features</Label>
              <div className="flex gap-2">
                <Input value={featureDraft} onChange={(e) => setFeatureDraft(e.target.value)} data-testid="feature-input"
                  placeholder="Real-time inventory sync" onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); if (featureDraft.trim()) { setFeatures([...features, featureDraft.trim()]); setFeatureDraft(''); } }
                  }} />
                <button type="button" onClick={() => { if (featureDraft.trim()) { setFeatures([...features, featureDraft.trim()]); setFeatureDraft(''); } }}
                  data-testid="feature-add" className="rounded-lg bg-white/10 px-3 hover:bg-white/20"><Plus size={16} /></button>
              </div>
              <ul className="mt-2 space-y-1.5" data-testid="feature-list">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 text-sm">
                    <span>{f}</span>
                    <button type="button" onClick={() => setFeatures(features.filter((_, j) => j !== i))} aria-label="Remove feature" className="text-red-400"><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label className="mb-1.5 block">Tech stack</Label>
              <div className="flex flex-wrap gap-1.5" data-testid="tech-selected">
                {tech.map((t) => (
                  <span key={t} className="flex items-center gap-1 rounded-full bg-electric/15 border border-electric/40 px-3 py-1 text-xs">
                    {t}
                    <button type="button" onClick={() => setTech(tech.filter((x) => x !== t))} aria-label={`Remove ${t}`}><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5" data-testid="tech-options">
                {allTech.filter((t) => !tech.includes(t)).map((t) => (
                  <button key={t} type="button" onClick={() => setTech([...tech, t])} data-testid={`tech-option-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60 hover:text-white">+ {t}</button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <Input value={techDraft} onChange={(e) => setTechDraft(e.target.value)} placeholder="Add new tech (e.g. Flutter)" data-testid="tech-new" />
                <button type="button" onClick={() => {
                  const t = techDraft.trim();
                  if (t && !tech.includes(t)) { setTech([...tech, t]); if (!allTech.includes(t)) setAllTech([...allTech, t]); }
                  setTechDraft('');
                }} className="rounded-lg bg-white/10 px-3 hover:bg-white/20"><Plus size={16} /></button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Cover image *</Label>
                <MediaUploader label="" folder={`projects/${initial?.id ?? 'new'}`} buttonLabel="Upload cover image"
                  onUploaded={(url) => setValue('cover_url', url, { shouldValidate: true })} />
                {values.cover_url ? (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-white/[0.04] p-2">
                    <div className="relative h-10 w-16 overflow-hidden rounded"><Image src={values.cover_url} alt="cover" fill sizes="64px" className="object-cover" /></div>
                    <button type="button" onClick={() => setValue('cover_url', '')} className="ml-auto text-xs text-red-400">Remove</button>
                  </div>
                ) : <p className="mt-2 text-xs text-amber-400">Tip: you can also paste a URL in Links tab, but uploading is better.</p>}
              </div>
              <div>
                <Label className="mb-1.5 block">Preview video (optional)</Label>
                <MediaUploader label="" accept="video/*" folder={`projects/${initial?.id ?? 'new'}`} buttonLabel="Upload preview video"
                  onUploaded={(url) => setValue('video_url', url)} />
                {values.video_url && (
                  <button type="button" onClick={() => setValue('video_url', '')} className="mt-2 text-xs text-red-400">Remove video</button>
                )}
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block">Gallery images (drag to reorder)</Label>
              <MediaUploader folder={`projects/${initial?.id ?? 'new'}/gallery`} buttonLabel="Upload gallery image"
                onUploaded={(url) => setGallery([...gallery, url])} />
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e: DragEndEvent) => {
                if (e.over?.id === e.active.id) return;
                setGallery((g) => arrayMove(g, g.indexOf(String(e.active.id)), g.indexOf(String(e.over!.id))));
              }}>
                <SortableContext items={gallery} strategy={verticalListSortingStrategy}>
                  <div className="mt-3 flex flex-wrap gap-2" data-testid="gallery-list">
                    {gallery.map((url) => (
                      <GalleryItem key={url} url={url} onRemove={() => setGallery(gallery.filter((g) => g !== url))} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              {!gallery.length && <p className="mt-2 text-xs text-white/40">No gallery images yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <Label className="mb-1.5 block">Live demo URL</Label>
                <Input data-testid="form-live-url" {...register('live_url')} placeholder="https://..." />
                {err(errors.live_url?.message)}
              </label>
              <label className="block">
                <Label className="mb-1.5 block">GitHub URL</Label>
                <Input data-testid="form-github-url" {...register('github_url')} placeholder="https://github.com/..." />
                {err(errors.github_url?.message)}
              </label>
            </div>
            <label className="block">
              <Label className="mb-1.5 block">Results / metrics (optional)</Label>
              <Input data-testid="form-results" {...register('results')} placeholder="3x faster checkout • +34% conversion" />
            </label>
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={!!values.featured} onCheckedChange={(v) => setValue('featured', v)} data-testid="form-featured" /> Featured project
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={!!values.published} onCheckedChange={(v) => setValue('published', v)} data-testid="form-published" /> Published (visible on site)
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 border-t border-white/8 pt-5">
          <button type="submit" disabled={saving} data-testid="form-submit"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett px-7 py-3 text-sm font-semibold disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {initial ? 'Save changes' : 'Create project'}
          </button>
          <Link href="/admin/projects" className="rounded-full border border-white/15 px-6 py-3 text-sm">Cancel</Link>
        </div>
      </div>

      {/* Live preview */}
      <aside className="hidden lg:block">
        <div className="sticky top-8 space-y-4 rounded-2xl glass p-4" data-testid="live-preview">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Live preview — card</p>
          <ProjectCard project={preview} />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Case-study hero</p>
          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="relative h-28 bg-gradient-to-br from-electric/30 to-violett/30">
              {values.cover_url && <Image src={values.cover_url} alt="" fill sizes="400px" className="object-cover opacity-60" />}
            </div>
            <div className="bg-panel p-4">
              <span className="rounded-full bg-electric/15 px-2 py-0.5 text-[10px] text-electric">{values.category}</span>
              <h3 className="mt-2 font-display font-bold">{preview.title}</h3>
              <p className="line-clamp-2 text-xs text-white/55">{values.short_description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {tech.slice(0, 4).map((t) => <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-white/50">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}
