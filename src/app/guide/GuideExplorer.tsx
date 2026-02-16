'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import type { GuideTab } from '@/data/guide-content';
import ExchangeRateWidget from './ExchangeRateWidget';
import styles from './guide.module.css';

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

  // Collapsed state for entries (Set of IDs)
  // Default: all expanded (empty set usually means expanded, or we track collapsed ones)
  const [collapsedEntries, setCollapsedEntries] = useState<Set<string>>(new Set());

  // Scroll offset logic same as Wiki SidebarToC
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
    setCollapsedEntries(new Set()); // Reset collapse state on group change
  }, [activeGroup]);

  const updateActiveEntry = useCallback(() => {
    if (!activeGroup || activeGroup.entries.length === 0) return;
    const line = window.scrollY + scrollOffset + 2;
    let candidate = activeGroup.entries[0]?.id ?? '';

    // Reverse check
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
        // Force scroll if needed (though browser handles hash usually)
        // logic similar to jumpTo
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
    // We don't want to auto-sync hash on load if it conflicts with standard browser behavior,
    // but enforcing offset is good.
    setTimeout(syncFromHash, 50); // Small delay to let layout settle

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
    <div className={styles.guidePage}>
      {/* ... Top Tabs ... */}
      <div className={styles.topTabs} role="tablist" aria-label="Guide categories">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab.id === tab.id}
            className={`${styles.topTab} ${activeTab.id === tab.id ? styles.topTabActive : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className={styles.docsGrid}>
        <aside className={styles.leftNav}>
          <p className={styles.leftTitle}>{activeTab.title}</p>
          <ul className={styles.leftList}>
            {activeTab.groups.map((group) => (
              <li key={group.id}>
                <Link
                  className={`${styles.leftLink} ${activeGroup.id === group.id ? styles.leftLinkActive : ''}`}
                  href={`/guide/${group.id}`}
                >
                  {group.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <p className={styles.kicker}>GUIDE</p>
          <h1 className={styles.mainTitle}>{activeTab.title}</h1>
          <p className={styles.subtitle}>{activeTab.subtitle}</p>
          <p className={styles.intro}>{activeTab.intro}</p>

          {activeTab.id === 'money' && <ExchangeRateWidget />}

          <section id={activeGroup.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{activeGroup.title}</h2>
            <p className={styles.sectionDesc}>{activeGroup.description}</p>
            <ul className={styles.entryList}>
              {activeGroup.entries.map((entry, index) => {
                const entryNum = `${index + 1}.`; // 1., 2., ...
                const isCollapsed = collapsedEntries.has(entry.id);

                return (
                  <li key={entry.id} id={entry.id} className={styles.entry}>
                    {/* Namu Style Heading */}
                    <div className={styles.namuEntryHeading}>
                      <span
                        className={styles.namuEntryNum}
                        onClick={() => jumpTo('toc')}
                        title="Go to Table of Contents"
                      >
                        {entryNum}
                      </span>
                      <div
                        className={styles.namuEntryContentWrapper}
                        onClick={() => toggleEntry(entry.id)}
                        title="Toggle Section"
                      >
                        <span className={styles.namuEntryTitleSpan}>
                          {entry.title}
                        </span>
                        <span
                          className={styles.namuEntryToggle}
                          style={{
                            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                            display: 'inline-flex'
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Entry Body */}
                    <div
                      className={styles.entryBody}
                      style={{ display: isCollapsed ? 'none' : 'block', marginTop: '12px' }}
                      dangerouslySetInnerHTML={{ __html: entry.content }}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </main>

        <aside className={styles.rightToc} id="toc"> {/* Added id=toc */}
          <p className={styles.tocTitle}>On this page</p>
          <ul className={styles.tocList}>
            {activeGroup.entries.map((entry, index) => {
              const entryNum = `${index + 1}.`;
              return (
                <li key={entry.id}>
                  <div className={styles.tocEntryRow}>
                    <a
                      className={styles.tocNumLink}
                      href={`#${entry.id}`}
                      onClick={(event) => onTocClick(event, entry.id)}
                    >
                      {entryNum}
                    </a>
                    <span className={styles.tocTextLabel}>
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
