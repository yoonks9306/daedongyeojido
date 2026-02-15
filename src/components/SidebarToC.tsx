'use client';

import { useEffect, useState, useCallback } from 'react';
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

  // Parse headings on mount
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
  }, [contentId]);

  // Track active heading via scroll position
  const updateActive = useCallback(() => {
    if (entries.length === 0) return;

    const scrollY = window.scrollY;
    const offset = 100; // account for nav bar height

    let current = entries[0].id;
    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el && el.offsetTop - offset <= scrollY) {
        current = entry.id;
      }
    }
    setActiveId(current);
  }, [entries]);

  useEffect(() => {
    if (entries.length === 0) return;

    // Set initial active
    updateActive();

    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [entries, updateActive]);

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
