'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
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

  if (!activeTab || !activeGroup) return null;

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
                <a className={styles.tocLink} href={`#${entry.id}`}>
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
