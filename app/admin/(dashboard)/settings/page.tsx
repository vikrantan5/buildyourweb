'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import MediaUploader from '@/components/admin/media-uploader';
import { createClient } from '@/lib/supabase/client';
import { updateSettings } from '@/actions/content';
import type { SiteSettings } from '@/types/database';
import { DEFAULT_SETTINGS } from '@/lib/sample-data';

export default function SettingsPage() {
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
      .then(({ data }) => setForm((data as unknown as SiteSettings) ?? DEFAULT_SETTINGS));
  }, []);

  if (!form) return <div className="mt-8 h-96 skeleton" />;

  const set = (k: keyof SiteSettings, v: unknown) => setForm({ ...form, [k]: v });
  const input = (k: keyof SiteSettings, label: string, testid: string, placeholder = '') => (
    <label className="block">
      <Label className="mb-1.5 block">{label}</Label>
      <Input data-testid={testid} value={String(form[k] ?? '')} placeholder={placeholder} onChange={(e) => set(k, e.target.value)} />
    </label>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Site Settings</h1>
      <p className="text-sm text-white/50">Everything here is live on the public site the moment you save.</p>

      <div className="mt-8 space-y-6 rounded-2xl glass p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric">Hero & branding</p>
        {input('hero_title', 'Hero headline', 'settings-hero-title')}
        <label className="block">
          <Label className="mb-1.5 block">Hero subtitle</Label>
          <textarea rows={2} data-testid="settings-hero-subtitle" value={form.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-electric/60" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {input('hero_badge', 'Availability badge text', 'settings-badge', 'Available for projects')}
          {input('tagline', 'Tagline', 'settings-tagline', 'Webs • Apps • And More')}
          {input('subline', 'Sub-line', 'settings-subline', 'Ideas → Code → Reality')}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.available_for_work} onCheckedChange={(v) => set('available_for_work', v)} data-testid="settings-available" />
          Show &quot;Available&quot; badge
        </label>
      </div>

      <div className="mt-6 space-y-6 rounded-2xl glass p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric">About</p>
        {input('about_title', 'About heading', 'settings-about-title')}
        <label className="block">
          <Label className="mb-1.5 block">About text</Label>
          <textarea rows={5} data-testid="settings-about-text" value={form.about_text} onChange={(e) => set('about_text', e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-electric/60" />
        </label>
      </div>

      <div className="mt-6 space-y-6 rounded-2xl glass p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric">Contact channels</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {input('instagram', 'Instagram handle', 'settings-instagram', 'buildwithme')}
          {input('whatsapp', 'WhatsApp number (with country code)', 'settings-whatsapp', '919999999999')}
          {input('email', 'Contact email', 'settings-email')}
        </div>
      </div>

      <div className="mt-6 space-y-6 rounded-2xl glass p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-electric">SEO</p>
        {input('seo_title', 'SEO title', 'settings-seo-title')}
        <label className="block">
          <Label className="mb-1.5 block">SEO description</Label>
          <textarea rows={2} data-testid="settings-seo-desc" value={form.seo_description} onChange={(e) => set('seo_description', e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-electric/60" />
        </label>
        <div>
          <Label className="mb-1.5 block">OG image</Label>
          <MediaUploader folder="site" buttonLabel="Upload OG image (1200×630)" onUploaded={(url) => set('og_image', url)} />
          {form.og_image && (
            <div className="relative mt-2 h-24 w-44 overflow-hidden rounded-lg border border-white/10">
              <Image src={form.og_image} alt="OG" fill sizes="176px" className="object-cover" />
              <button type="button" onClick={() => set('og_image', '')} className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-red-300">Remove</button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={async () => {
          setSaving(true);
          try {
            await toast.promise(updateSettings(form), { success: 'Settings saved — site refreshed', error: 'Save failed' });
          } finally { setSaving(false); }
        }}
        disabled={saving}
        data-testid="settings-save"
        className="mt-8 flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-violett px-7 py-3 text-sm font-semibold disabled:opacity-60"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save settings
      </button>
    </div>
  );
}
