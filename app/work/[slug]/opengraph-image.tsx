import { ImageResponse } from 'next/og';
import { getProjectBySlug } from '@/lib/data';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: { slug: string } }) {
  const p = await getProjectBySlug(params.slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center', padding: 80,
          background: 'linear-gradient(135deg, #05060A 0%, #0A0F2E 55%, #1B0B3A 100%)',
          color: 'white', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: '#8ab8ff' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#0A0C14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5FF', fontSize: 34, fontWeight: 700 }}>W</div>
          BuildWithMe — Case Study
        </div>
        <div style={{ fontSize: p && p.title.length > 18 ? 76 : 92, fontWeight: 700, marginTop: 40, maxWidth: 1000, lineHeight: 1.05 }}>
          {p?.title ?? 'Project'}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 36 }}>
          {[p?.category, p ? String(p.year) : null, p?.role].filter(Boolean).map((chip) => (
            <div key={String(chip)} style={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '10px 28px', fontSize: 26, color: 'rgba(255,255,255,0.8)' }}>
              {String(chip)}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
