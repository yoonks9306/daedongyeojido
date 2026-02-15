'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from './ThemeProvider';
import styles from './Navigation.module.css';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [ip, setIp] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user) {
      fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then((d: { ip: string }) => setIp(d.ip))
        .catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/' || pathname.startsWith('/guide');
    return pathname.startsWith(href);
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/wiki?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  }

  const userIdentifier = session?.user?.email ?? session?.user?.name ?? null;

  return (
    <>
      <nav className={styles.nav} role="navigation" aria-label="Main navigation">
        <div className={styles.navInner}>
          <Link href="/" className={styles.logo} aria-label="KorWiki Home">
            Kor<span>Wiki</span>
          </Link>

          <div className={styles.tabs} role="tablist">
            <Link
              href="/"
              className={`${styles.tab} ${isActive('/') ? styles.tabActive : ''}`}
            >
              Guide
            </Link>
            <Link
              href="/wiki"
              className={`${styles.tab} ${isActive('/wiki') ? styles.tabActive : ''}`}
            >
              Wiki
            </Link>
            <Link
              href="/community"
              className={`${styles.tab} ${isActive('/community') ? styles.tabActive : ''}`}
            >
              Community
            </Link>
          </div>

          <form onSubmit={handleSearch} className={styles.searchForm} role="search">
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search wiki..."
              className={styles.searchInput}
              aria-label="Search KorWiki"
            />
          </form>

          <div className={styles.userMenu} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={`${styles.loginBtn} ${menuOpen ? styles.loginBtnActive : ''}`}
              aria-label="User menu"
              aria-expanded={menuOpen}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%', display: 'block' }}
                />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  {session?.user ? (
                    <>
                      <span className={styles.dropdownLabel}>Signed in as</span>
                      <span className={styles.dropdownUserInfo}>{userIdentifier}</span>
                    </>
                  ) : (
                    <>
                      <span className={styles.dropdownLabel}>Your IP</span>
                      <span className={styles.dropdownUserInfo}>{ip ?? '…'}</span>
                    </>
                  )}
                </div>

                <div className={styles.dropdownDivider} />

                <button
                  className={styles.dropdownItem}
                  onClick={() => { toggleTheme(); setMenuOpen(false); }}
                >
                  {theme === 'light' ? 'Dark mode' : 'Light mode'}
                </button>

                <div className={styles.dropdownDivider} />

                {session?.user ? (
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false); }}
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className={styles.dropdownItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Leaderboard ad slot pinned below nav */}
      <div className={styles.adSlotWrapper}>
        <div style={{
          width: '728px',
          maxWidth: '100%',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed var(--color-border-primary)',
          borderRadius: 'var(--border-radius-md)',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-size-xs)',
          fontFamily: 'var(--font-mono)',
          position: 'relative',
        }}>
          <span style={{ opacity: 0.6 }}>728 × 90 — Leaderboard</span>
        </div>
      </div>
    </>
  );
}
