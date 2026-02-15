import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
          color: '#e6edf3',
          padding: '56px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: '#8b949e',
            letterSpacing: 1.5,
          }}
        >
          KOREA TRAVEL WIKI
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1 }}>KorWiki</div>
          <div style={{ fontSize: 34, color: '#8b949e' }}>
            Guides, wiki articles, and community tips for Korea.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 24,
            color: '#e74c3c',
          }}
        >
          <span>daedongyeojido.vercel.app</span>
        </div>
      </div>
    ),
    size
  );
}
