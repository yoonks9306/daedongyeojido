'use client';

import { useEffect, useState } from 'react';
import styles from './WikiArticle.module.css';

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

interface SidebarToCProps {
  contentId: string;
}

export default function SidebarToC({ contentId }: SidebarToCProps) {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;

    const headings = contentEl.querySelectorAll<HTMLHeadingElement>('h2, h3');
    const parsed: TocEntry[] = [];

    headings.forEach((h, idx) => {
      if (!h.id) h.id = `heading-${idx}`;
      parsed.push({
        id: h.id,
        text: h.textContent ?? '',
        level: Number(h.tagName[1]) as 2 | 3,
      });
    });

    setEntries(parsed);

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-60px 0px -70% 0px' }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, [contentId]);

  if (entries.length === 0) return null;

  return (
    <div className={styles.tocBox}>
      <p className={styles.tocTitle}>Contents</p>
      <ol className={styles.tocList}>
        {entries.map(entry => (
          <li key={entry.id} className={styles.tocItem}>
            <a
              href={`#${entry.id}`}
              className={[
                styles.tocLink,
                entry.level === 3 ? styles.tocLinkH3 : '',
                activeId === entry.id ? styles.tocLinkActive : '',
              ].join(' ')}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
