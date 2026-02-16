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
  const [scrollOffset, setScrollOffset] = useState(180);

  const resolveScrollOffset = useCallback(() => {
    const root = getComputedStyle(document.documentElement);
    const nav = Number.parseInt(root.getPropertyValue('--nav-height'), 10) || 56;
    const ad = Number.parseInt(root.getPropertyValue('--ad-banner-height'), 10) || 0;
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
  }, [activeGroup]);

  const updateActiveEntry = useCallback(() => {
    if (!activeGroup || activeGroup.entries.length === 0) return;
    const line = window.scrollY + scrollOffset + 2;
    let candidate = activeGroup.entries[0]?.id ?? '';

    for (const entry of activeGroup.entries) {
      const el = document.getElementById(entry.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= line) {
        candidate = entry.id;
      } else {
        break;
      }
    }

    setActiveEntryId(candidate);
  }, [activeGroup, scrollOffset]);

  useEffect(() => {
    if (!activeGroup) return;

    const syncFromHash = () => {
      const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
      if (hashId && activeGroup.entries.some((entry) => entry.id === hashId)) {
        setActiveEntryId(hashId);
        return;
      }
      updateActiveEntry();
    };

    updateActiveEntry();
    syncFromHash();

    window.addEventListener('scroll', updateActiveEntry, { passive: true });
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('scroll', updateActiveEntry);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [activeGroup, updateActiveEntry]);

  if (!activeTab || !activeGroup) return null;

  const onTocClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
    history.replaceState(null, '', `#${id}`);
    setActiveEntryId(id);
  };

  return (
    <div className={styles.guidePage}>
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
              {activeGroup.entries.map((entry) => (
                <li key={entry.id} id={entry.id} className={styles.entry}>
                  <h3 className={styles.entryTitle}>{entry.title}</h3>
                  <div
                    className={styles.entryBody}
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                </li>
              ))}
            </ul>
          </section>
        </main>

        <aside className={styles.rightToc}>
          <p className={styles.tocTitle}>On this page</p>
          <ul className={styles.tocList}>
            {activeGroup.entries.map((entry) => (
              <li key={entry.id}>
                <a
                  className={`${styles.tocLink} ${activeEntryId === entry.id ? styles.tocLinkActive : ''}`}
                  href={`#${entry.id}`}
                  onClick={(event) => onTocClick(event, entry.id)}
                >
                  {entry.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
