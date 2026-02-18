'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import type { GuideTab } from '@/data/guide-content';
import ExchangeRateWidget from './ExchangeRateWidget';
import { cn } from '@/lib/utils';

export default function GuideExplorer({
  tabs,
  initialGroupId,
}: {
  tabs: GuideTab[];
  initialGroupId?: string;
}) {
  const initialTab = useMemo(() => {
    if (!initialGroupId) return tabs[0];
    return tabs.find((tab) => tab.groups.some((group) => group.id === initialGroupId)) ?? tabs[0];
  }, [tabs, initialGroupId]);

  const [activeTabId, setActiveTabId] = useState<string>(initialTab?.id ?? tabs[0]?.id ?? '');

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [activeTabId, tabs]
  );

  const activeGroup = useMemo(() => {
    if (!activeTab) return null;
    if (initialGroupId && activeTab.groups.some((group) => group.id === initialGroupId)) {
      return activeTab.groups.find((group) => group.id === initialGroupId) ?? activeTab.groups[0];
    }
    return activeTab.groups[0];
  }, [activeTab, initialGroupId]);

  const [activeEntryId, setActiveEntryId] = useState<string>(activeGroup?.entries[0]?.id ?? '');
  const [collapsedEntries, setCollapsedEntries] = useState<Set<string>>(new Set());
  const [scrollOffset, setScrollOffset] = useState(180);

  const resolveScrollOffset = useCallback(() => {
    if (typeof window === 'undefined') return;
    const root = getComputedStyle(document.documentElement);
    const nav = Number.parseInt(root.getPropertyValue('--nav-height'), 10) || 56;
    const ad = Number.parseInt(root.getPropertyValue('--ad-banner-height'), 10) || 106;
    setScrollOffset(nav + ad + 16);
  }, []);

  useEffect(() => {
    resolveScrollOffset();
    window.addEventListener('resize', resolveScrollOffset);
    return () => window.removeEventListener('resize', resolveScrollOffset);
  }, [resolveScrollOffset]);

  useEffect(() => {
    if (!activeGroup) return;
    setActiveEntryId(activeGroup.entries[0]?.id ?? '');
    setCollapsedEntries(new Set());
  }, [activeGroup]);

  const updateActiveEntry = useCallback(() => {
    if (!activeGroup || activeGroup.entries.length === 0) return;
    const line = window.scrollY + scrollOffset + 2;
    let candidate = activeGroup.entries[0]?.id ?? '';

    for (let i = activeGroup.entries.length - 1; i >= 0; i--) {
      const entry = activeGroup.entries[i];
      const el = document.getElementById(entry.id);
      if (el && el.getBoundingClientRect().top + window.scrollY <= line) {
        candidate = entry.id;
        break;
      }
    }

    setActiveEntryId(candidate);
  }, [activeGroup, scrollOffset]);

  useEffect(() => {
    if (!activeGroup) return;

    const syncFromHash = () => {
      const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
      if (hashId === 'toc') {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        return;
      }
      if (hashId && activeGroup.entries.some((entry) => entry.id === hashId)) {
        setActiveEntryId(hashId);
        const el = document.getElementById(hashId);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
          window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
        }
        return;
      }
      updateActiveEntry();
    };

    updateActiveEntry();
    setTimeout(syncFromHash, 50);

    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [activeGroup, scrollOffset]);

  if (!activeTab || !activeGroup) return null;

  const jumpTo = (id: string) => {
    if (id === 'toc') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      history.replaceState(null, '', '#toc');
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    history.replaceState(null, '', `#${id}`);
  };

  const onTocClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    jumpTo(id);
  };

  const toggleEntry = (id: string) => {
    const newSet = new Set(collapsedEntries);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCollapsedEntries(newSet);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-4">
      {/* Top Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-1 mb-5" role="tablist" aria-label="Guide categories">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab.id === tab.id}
            className={cn(
              'border-none bg-transparent text-muted-foreground font-sans py-2.5 px-3 whitespace-nowrap cursor-pointer border-b-2 border-transparent',
              activeTab.id === tab.id && 'text-foreground border-b-primary'
            )}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[240px_minmax(0,1fr)_220px] gap-6 max-[1120px]:grid-cols-[220px_minmax(0,1fr)] max-[860px]:grid-cols-1">
        <aside className="sticky top-[calc(var(--nav-height)+var(--ad-banner-height)+1rem)] self-start max-h-[calc(100vh-var(--nav-height)-var(--ad-banner-height)-2rem)] overflow-y-auto max-[860px]:static max-[860px]:max-h-none max-[860px]:overflow-visible max-[860px]:border max-[860px]:border-border max-[860px]:rounded-sm max-[860px]:bg-card max-[860px]:dark:bg-surface max-[860px]:p-3">
          <p className="text-sm font-semibold text-muted-foreground mb-3">{activeTab.title}</p>
          <ul className="list-none m-0 p-0">
            {activeTab.groups.map((group) => (
              <li key={group.id}>
                <Link
                  className={cn(
                    'block text-sm text-muted-foreground no-underline py-2 px-2.5 rounded-sm visited:text-muted-foreground hover:text-foreground hover:bg-card dark:hover:bg-surface',
                    activeGroup.id === group.id && 'text-foreground bg-primary/12 border border-primary/30'
                  )}
                  href={`/guide/${group.id}`}
                >
                  {group.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="min-w-0">
          <p className="text-xs font-semibold tracking-widest text-primary mb-2">GUIDE</p>
          <h1 className="text-4xl m-0 mb-2 border-none">{activeTab.title}</h1>
          <p className="text-muted-foreground text-lg mb-3">{activeTab.subtitle}</p>
          <p className="text-muted-foreground leading-relaxed mb-6">{activeTab.intro}</p>

          {activeTab.id === 'money' && <ExchangeRateWidget />}

          <section id={activeGroup.id} className="mb-8">
            <h2 className="text-xl mb-2 border-none p-0">{activeGroup.title}</h2>
            <p className="text-muted-foreground mb-3 text-sm">{activeGroup.description}</p>
            <ul className="list-none m-0 p-0 grid gap-3">
              {activeGroup.entries.map((entry, index) => {
                const entryNum = `${index + 1}.`;
                const isCollapsed = collapsedEntries.has(entry.id);

                return (
                  <li key={entry.id} id={entry.id} className="border border-border bg-card dark:bg-surface rounded-sm p-4 scroll-mt-[calc(var(--nav-height)+var(--ad-banner-height)+1rem)]">
                    <div className="flex items-center gap-2 cursor-pointer mb-3 scroll-mt-[calc(var(--nav-height)+var(--ad-banner-height)+1rem)]">
                      <span
                        className="text-primary font-bold cursor-pointer select-none text-[0.9em] mr-1 hover:underline"
                        onClick={() => jumpTo('toc')}
                        title="Go to Table of Contents"
                      >
                        {entryNum}
                      </span>
                      <div
                        className="flex items-center justify-between gap-1.5 cursor-pointer flex-1"
                        onClick={() => toggleEntry(entry.id)}
                        title="Toggle Section"
                      >
                        <span className="cursor-pointer text-lg font-bold">
                          {entry.title}
                        </span>
                        <span
                          className="inline-flex items-center justify-center text-muted-foreground select-none ml-3"
                          style={{
                            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </div>
                    </div>

                    <div
                      className="wiki-content text-muted-foreground leading-relaxed [&_p:last-child]:mb-0"
                      style={{ display: isCollapsed ? 'none' : 'block', marginTop: '12px' }}
                      dangerouslySetInnerHTML={{ __html: entry.content }}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </main>

        <aside className="sticky top-[calc(var(--nav-height)+var(--ad-banner-height)+1rem)] self-start max-h-[calc(100vh-var(--nav-height)-var(--ad-banner-height)-2rem)] overflow-y-auto max-[1120px]:hidden" id="toc">
          <p className="text-sm font-semibold text-muted-foreground mb-3">On this page</p>
          <ul className="list-none m-0 p-0">
            {activeGroup.entries.map((entry, index) => {
              const entryNum = `${index + 1}.`;
              return (
                <li key={entry.id}>
                  <div className="flex items-baseline gap-1.5 py-1 px-1.5 rounded-sm transition-colors hover:bg-card dark:hover:bg-surface">
                    <a
                      className="text-primary text-sm font-medium no-underline shrink-0 hover:underline"
                      href={`#${entry.id}`}
                      onClick={(event) => onTocClick(event, entry.id)}
                    >
                      {entryNum}
                    </a>
                    <span className="text-foreground text-sm">
                      {entry.title}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
