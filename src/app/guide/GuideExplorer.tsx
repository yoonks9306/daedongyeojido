'use client';

import { useMemo, useState } from 'react';
import type { GuideTab } from '@/data/guide-content';
import ExchangeRateWidget from './ExchangeRateWidget';
import styles from './guide.module.css';

export default function GuideExplorer({ tabs }: { tabs: GuideTab[] }) {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id ?? '');

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [activeTabId, tabs]
  );

  if (!activeTab) return null;

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
                <a className={styles.leftLink} href={`#${group.id}`}>
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <main className={styles.mainContent}>
          <p className={styles.kicker}>GUIDE</p>
          <h1 className={styles.mainTitle}>{activeTab.title.replace(/^\d+\.\s*/, '')}</h1>
          <p className={styles.subtitle}>{activeTab.subtitle}</p>
          <p className={styles.intro}>{activeTab.intro}</p>

          {activeTab.id === 'money' && <ExchangeRateWidget />}

          {activeTab.groups.map((group) => (
            <section key={group.id} id={group.id} className={styles.section}>
              <h2 className={styles.sectionTitle}>{group.title}</h2>
              <p className={styles.sectionDesc}>{group.description}</p>
              <ul className={styles.entryList}>
                {group.entries.map((entry) => (
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
          ))}
        </main>

        <aside className={styles.rightToc}>
          <p className={styles.tocTitle}>On this page</p>
          <ul className={styles.tocList}>
            {activeTab.groups.map((group) => (
              <li key={group.id}>
                <a className={styles.tocLink} href={`#${group.id}`}>
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
