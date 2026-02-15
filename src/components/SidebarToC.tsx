'use client';

import { useEffect, useState, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import styles from './WikiArticle.module.css';

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

interface SidebarToCProps {
  contentId: string;
  observeKey?: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function SidebarToC({ contentId, observeKey }: SidebarToCProps) {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [scrollOffset, setScrollOffset] = useState(180);

  const resolveScrollOffset = useCallback(() => {
    const root = getComputedStyle(document.documentElement);
    const nav = Number.parseInt(root.getPropertyValue('--nav-height'), 10) || 56;
    const ad = Number.parseInt(root.getPropertyValue('--ad-banner-height'), 10) || 0;
    setScrollOffset(nav + ad + 16);
  }, []);

  const getLiveOffset = useCallback(() => {
    const root = getComputedStyle(document.documentElement);
    const nav = Number.parseInt(root.getPropertyValue('--nav-height'), 10) || 56;
    const ad = Number.parseInt(root.getPropertyValue('--ad-banner-height'), 10) || 0;
    return nav + ad + 16;
  }, []);

  const jumpToId = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - getLiveOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
    setActiveId(id);
  }, [getLiveOffset]);

  useEffect(() => {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;

    const cleanupCallbacks: Array<() => void> = [];

    const normalizeHeadingIds = () => {
      const used = new Set<string>();
      const all = contentEl.querySelectorAll<HTMLHeadingElement>('h2, h3');

      all.forEach((heading, idx) => {
        const raw = heading.id?.trim();
        const textBase = slugify(heading.textContent ?? '');
        const fallbackBase = `${heading.tagName.toLowerCase()}-${idx + 1}`;
        const base = raw || textBase || fallbackBase;

        let candidate = base;
        let suffix = 2;
        while (used.has(candidate)) {
          candidate = `${base}-${suffix}`;
          suffix += 1;
        }
        used.add(candidate);
        heading.id = candidate;
      });
    };

    const initHeadings = () => {
      const h2Headings = contentEl.querySelectorAll<HTMLHeadingElement>('h2');
      if (h2Headings.length === 0) return false;

      normalizeHeadingIds();

      h2Headings.forEach((heading) => {
        if (heading.dataset.collapsibleReady === 'true') return;

        const originalText = heading.textContent?.trim() ?? '';
        heading.dataset.tocLabel = originalText;
        heading.classList.add(styles.collapsibleHeading);
        heading.tabIndex = 0;
        heading.setAttribute('role', 'button');
        heading.setAttribute('aria-expanded', 'true');

        const headingLabel = document.createElement('span');
        headingLabel.className = styles.headingLabel;
        headingLabel.textContent = originalText;
        heading.textContent = '';
        heading.appendChild(headingLabel);

        const headingActions = document.createElement('span');
        headingActions.className = styles.headingActions;

        const toggleIcon = document.createElement('span');
        toggleIcon.className = styles.sectionToggle;
        toggleIcon.textContent = '▾';
        toggleIcon.setAttribute('aria-hidden', 'true');

        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = styles.sectionToggleBtn;
        toggleButton.setAttribute('aria-label', `Collapse section ${originalText}`);
        toggleButton.appendChild(toggleIcon);

        headingActions.appendChild(toggleButton);
        heading.appendChild(headingActions);

        const sectionBody = document.createElement('div');
        sectionBody.className = styles.sectionBody;

        let cursor = heading.nextSibling;
        while (cursor) {
          const next = cursor.nextSibling;
          if (cursor instanceof HTMLHeadingElement && cursor.tagName === 'H2') break;
          sectionBody.appendChild(cursor);
          cursor = next;
        }
        heading.parentNode?.insertBefore(sectionBody, cursor);

        const toggleSection = () => {
          const collapsed = sectionBody.style.display === 'none';
          sectionBody.style.display = collapsed ? '' : 'none';
          heading.classList.toggle(styles.collapsed, !collapsed);
          heading.setAttribute('aria-expanded', String(collapsed));
          toggleIcon.textContent = collapsed ? '▾' : '▸';
        };

        const jumpToHeading = () => jumpToId(heading.id);

        const onHeadingClick = (event: MouseEvent) => {
          if ((event.target as HTMLElement).closest('button')) return;
          jumpToHeading();
        };
        const onHeadingKeydown = (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            jumpToHeading();
          }
        };
        const onToggleClick = (event: MouseEvent) => {
          event.stopPropagation();
          toggleSection();
        };

        heading.addEventListener('click', onHeadingClick);
        heading.addEventListener('keydown', onHeadingKeydown);
        toggleButton.addEventListener('click', onToggleClick);
        cleanupCallbacks.push(() => heading.removeEventListener('click', onHeadingClick));
        cleanupCallbacks.push(() => heading.removeEventListener('keydown', onHeadingKeydown));
        cleanupCallbacks.push(() => toggleButton.removeEventListener('click', onToggleClick));

        heading.dataset.collapsibleReady = 'true';
      });

      const allHeadings = contentEl.querySelectorAll<HTMLHeadingElement>('h2, h3');
      const seen = new Set<string>();
      const parsed = Array.from(allHeadings).map((heading) => {
        if (seen.has(heading.id)) return null;
        seen.add(heading.id);
        return {
          id: heading.id,
          text: heading.dataset.tocLabel ?? heading.textContent?.trim() ?? '',
          level: Number(heading.tagName[1]) as 2 | 3,
        };
      }).filter((entry): entry is TocEntry => entry !== null);
      setEntries(parsed);
      return true;
    };

    const initialized = initHeadings();
    let observer: MutationObserver | null = null;
    if (!initialized) {
      observer = new MutationObserver(() => {
        const ok = initHeadings();
        if (ok && observer) {
          observer.disconnect();
          observer = null;
        }
      });
      observer.observe(contentEl, { childList: true, subtree: true });
    }

    return () => {
      cleanupCallbacks.forEach((fn) => fn());
      if (observer) observer.disconnect();
    };
  }, [contentId, observeKey, jumpToId]);

  const updateActive = useCallback(() => {
    if (entries.length === 0) return;

    const line = window.scrollY + scrollOffset + 2;
    let candidate = entries[0].id;

    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= line) {
        candidate = entry.id;
      } else {
        break;
      }
    }

    setActiveId(candidate);
  }, [entries, scrollOffset]);

  useEffect(() => {
    resolveScrollOffset();
    window.addEventListener('resize', resolveScrollOffset);
    return () => window.removeEventListener('resize', resolveScrollOffset);
  }, [resolveScrollOffset]);

  useEffect(() => {
    if (entries.length === 0) return;

    const syncFromHash = () => {
      const hashId = decodeURIComponent(window.location.hash.replace('#', ''));
      if (hashId) {
        setActiveId(hashId);
        return;
      }
      updateActive();
    };

    updateActive();
    syncFromHash();

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [entries, updateActive]);

  if (entries.length === 0) return null;

  const onTocClick = (event: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    jumpToId(id);
  };

  return (
    <div className={styles.tocBox}>
      <p className={styles.tocTitle}>Contents</p>
      <ol className={styles.tocList}>
        {entries.map(entry => (
          <li key={entry.id} className={styles.tocItem}>
            <a
              href={`#${entry.id}`}
              onClick={(event) => onTocClick(event, entry.id)}
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
