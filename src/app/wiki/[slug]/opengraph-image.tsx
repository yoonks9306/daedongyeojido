import { ImageResponse } from 'next/og';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase
    .from('wiki_articles')
    .select('title, category')
    .eq('slug', slug)
    .single();

  const title = data?.title ?? 'KorWiki Article';
  const category = data?.category ?? 'Wiki';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(140deg, #161b22 0%, #0d1117 100%)',
          color: '#e6edf3',
          padding: '56px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 28, color: '#8b949e' }}>KORWIKI ARTICLE</div>
          <div
            style={{
              fontSize: 24,
              color: '#e74c3c',
              border: '1px solid #e74c3c',
              borderRadius: 999,
              padding: '8px 16px',
            }}
          >
            {category}
          </div>
        </div>

        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.12, maxWidth: '95%' }}>{title}</div>

        <div style={{ fontSize: 24, color: '#8b949e' }}>daedongyeojido.vercel.app/wiki/{slug}</div>
      </div>
    ),
    size
  );
}
