import type { Metadata } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import Navigation from '@/components/Navigation';
import AdBanner from '@/components/AdBanner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://daedongyeojido.vercel.app'),
  title: {
    default: 'KorWiki — Korea Travel Guide for Foreigners',
    template: '%s | KorWiki',
  },
  description:
    'The definitive English-language travel wiki for foreigners visiting Korea. Guides, wiki articles, and community tips.',
  keywords: [
    'Korea travel',
    'Seoul guide',
    'Korea wiki',
    'foreigners Korea',
    'Korea tourism',
    '한국 여행',
    '서울 여행',
    '외국인 한국 가이드',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ko_KR'],
    title: 'KorWiki — Korea Travel Guide for Foreigners',
    description: 'Guides, wiki articles, and community tips for traveling in Korea.',
    url: '/',
    siteName: 'KorWiki',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'KorWiki',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KorWiki — Korea Travel Guide for Foreigners',
    description: 'Guides, wiki articles, and community tips for traveling in Korea.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1126883662685001"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <AuthProvider>
        <ThemeProvider>
          <Navigation />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <AdBanner slot="leaderboard" />
          </div>
          <div className="main-content">
            {children}
          </div>
          <footer style={{
            borderTop: '1px solid var(--color-border-primary)',
            padding: '24px',
            textAlign: 'center',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            marginTop: '48px',
            backgroundColor: 'var(--color-bg-secondary)',
          }}>
            <p>© 2026 KorWiki — English Travel Guide for Korea</p>
            <p style={{ marginTop: '4px' }}>
              Not affiliated with any Korean government agency. Information provided for travelers.
            </p>
          </footer>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
