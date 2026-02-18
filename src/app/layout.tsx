import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import Navigation from '@/components/Navigation';
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
      <body>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1126883662685001"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <AuthProvider>
        <ThemeProvider>
          <Navigation />
          <div className="pt-[calc(var(--nav-height)+var(--ad-banner-height))] min-h-screen">
            {children}
          </div>
          <footer className="border-t border-border p-6 text-center text-sm text-muted-foreground mt-12 bg-card dark:bg-background">
            <p>© 2026 KorWiki — English Travel Guide for Korea</p>
            <p className="mt-1">
              Not affiliated with any Korean government agency. Information provided for travelers.
            </p>
          </footer>
        </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
