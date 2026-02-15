import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import AuthProvider from '@/components/AuthProvider';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'KorWiki — Korea Travel Guide for Foreigners',
    template: '%s | KorWiki',
  },
  description:
    'The definitive English-language travel wiki for foreigners visiting Korea. Guides, wiki articles, and community tips.',
  keywords: ['Korea travel', 'Seoul guide', 'Korea wiki', 'foreigners Korea', 'Korea tourism'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <ThemeProvider>
          <Navigation />
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
