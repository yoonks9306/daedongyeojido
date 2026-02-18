'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Guide' },
  { href: '/wiki', label: 'Wiki' },
  { href: '/community', label: 'Community' },
] as const;

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) {
      fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then((d: { ip: string }) => setIp(d.ip))
        .catch(() => {});
    }
  }, [session]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/guide');
    return pathname.startsWith(href);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/wiki?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  }

  const userIdentifier = session?.user?.email ?? session?.user?.name ?? null;

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 h-14 bg-card dark:bg-background border-b border-border z-[100] flex items-center"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-[1200px] w-full mx-auto px-6 flex items-center gap-5 max-md:px-4 max-md:gap-3">
          <Link
            href="/"
            className="text-xl font-bold text-primary no-underline tracking-tight shrink-0 leading-none"
            aria-label="KorWiki Home"
          >
            Kor<span className="text-foreground font-normal max-md:hidden">Wiki</span>
          </Link>

          <div className="flex items-stretch h-14 shrink-0" role="tablist">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center px-5 text-sm font-medium no-underline border-b-[3px] border-transparent transition-colors tracking-[0.01em] max-md:px-3 max-md:text-xs',
                  isActive(href)
                    ? 'text-primary border-b-primary font-semibold'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-[380px] ml-auto max-lg:max-w-[240px] max-md:max-w-[160px] max-[480px]:hidden"
            role="search"
          >
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search wiki..."
              className="w-full py-2 px-3 border border-border rounded-sm bg-card dark:bg-background text-foreground text-sm font-sans transition-colors placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
              aria-label="Search KorWiki"
            />
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center w-[38px] h-[38px] border border-border rounded-full bg-card dark:bg-background text-muted-foreground transition-colors shrink-0 overflow-hidden p-0 hover:bg-muted hover:text-primary data-[state=open]:bg-muted data-[state=open]:border-primary"
                aria-label="User menu"
              >
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    className="w-full h-full block object-cover"
                  />
                ) : (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-[200px] z-[200]">
              <DropdownMenuLabel className="font-normal">
                {session?.user ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Signed in as</span>
                    <span className="text-sm font-medium text-foreground break-all">{userIdentifier}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Your IP</span>
                    <span className="text-sm font-medium text-foreground break-all">{ip ?? '...'}</span>
                  </div>
                )}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={toggleTheme}>
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {session?.user ? (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login">Sign in</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Leaderboard ad slot pinned below nav */}
      <div className="fixed top-14 inset-x-0 z-[99] flex justify-center items-center bg-card dark:bg-background border-b border-border py-2 min-h-[var(--ad-banner-height)] max-md:hidden">
        <div className="w-[728px] max-w-full h-[90px] flex items-center justify-center border-2 border-dashed border-border rounded-sm text-muted-foreground text-xs font-mono relative">
          <span className="opacity-60">728 x 90 — Leaderboard</span>
        </div>
      </div>
    </>
  );
}
