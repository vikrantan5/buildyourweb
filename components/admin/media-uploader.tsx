'use client';

import { useRef, useState } from 'react';
import { Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

async function compressImage(file: File): Promise<Blob> {
  if (file.type.startsWith('video') || file.size < 400_000) return file;
  try {
    const img = await createImageBitmap(file);
    const max = 1920;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((res) => canvas.toBlob((b) => res(b || file), 'image/jpeg', 0.82));
  } catch {
    return file;
  }
}

export default function MediaUploader({
  label, accept = 'image/*', folder = 'misc', onUploaded, buttonLabel,
}: {
  label?: string;
  accept?: string;
  folder?: string;
  buttonLabel?: string;
  onUploaded: (publicUrl: string, path: string) => void;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setProgress(0);
    try {
      const blob = await compressImage(file);
      const ext = file.type.startsWith('video') ? 'mp4' : 'jpg';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/portfolio-media/${path}`);
        xhr.setRequestHeader('Authorization', `Bearer ${session?.access_token ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
        xhr.setRequestHeader('apikey', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        xhr.setRequestHeader('Content-Type', blob.type || 'application/octet-stream');
        xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(blob);
      });
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(path);
      onUploaded(data.publicUrl, path);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed. Are migrations run?');
    } finally {
      setProgress(null);
    }
  };

  return (
    <div data-testid={`media-uploader-${folder}`}>
      {label && <p className="mb-1.5 text-xs font-medium text-white/60">{label}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={progress !== null}
        data-testid="media-upload-trigger"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-xs text-white/60 transition-colors hover:border-electric/50 hover:text-white disabled:opacity-50"
      >
        {progress !== null ? <><Loader2 size={14} className="animate-spin" /> Uploading… {progress}%</> : <><UploadCloud size={15} /> {buttonLabel ?? 'Upload'}</>}
      </button>
      {progress !== null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-electric to-violett transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
