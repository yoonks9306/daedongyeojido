'use client';

import { useEffect, useState, useRef, type MouseEvent as ReactMouseEvent } from 'react';
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

/** Compute scroll offset from CSS custom properties (nav + ad banner). */
function getScrollOffset(): number {
  const root = getComputedStyle(document.documentElement);
  const nav = Number.parseInt(root.getPropertyValue('--nav-height'), 10) || 56;
  const ad = Number.parseInt(root.getPropertyValue('--ad-banner-height'), 10) || 0;
  return nav + ad + 16;
}

/** Namu-style instant jump + replaceState (no history pollution). */
function jumpTo(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
  window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  history.replaceState(null, '', `#${id}`);
}

export default function SidebarToC({ contentId, observeKey }: SidebarToCProps) {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const entriesRef = useRef<TocEntry[]>([]);

  // ---- Main initialization: poll until content DOM is ready ----
  useEffect(() => {
    let cancelled = false;
    let rafId: number;
    let attempts = 0;
    const cleanupCallbacks: Array<() => void> = [];

    const tryInit = () => {
      if (cancelled) return;
      attempts += 1;

      const contentEl = document.getElementById(contentId);
      if (!contentEl || contentEl.querySelectorAll<HTMLHeadingElement>('h2').length === 0) {
        // Content not ready yet — keep polling (cap at ~2s)
        if (attempts < 120) {
          rafId = requestAnimationFrame(tryInit);
        }
        return;
      }

      // ---- 1. Normalize heading IDs (deduplicate) ----
      const usedIds = new Set<string>();
      contentEl.querySelectorAll<HTMLHeadingElement>('h2, h3').forEach((heading, idx) => {
        const raw = heading.id?.trim();
        const textBase = slugify(heading.textContent ?? '');
        const fallback = `${heading.tagName.toLowerCase()}-${idx + 1}`;
        const base = raw || textBase || fallback;
        let candidate = base;
        let suffix = 2;
        while (usedIds.has(candidate)) {
          candidate = `${base}-${suffix}`;
          suffix += 1;
        }
        usedIds.add(candidate);
        heading.id = candidate;
      });

      // ---- 2. Collapsible sections (Namu-style) ----
      contentEl.querySelectorAll<HTMLHeadingElement>('h2').forEach((heading) => {
        if (heading.dataset.collapsibleReady === 'true') return;

        const originalText = heading.textContent?.trim() ?? '';
        heading.dataset.tocLabel = originalText;
        heading.classList.add(styles.collapsibleHeading);
        heading.tabIndex = 0;
        heading.setAttribute('role', 'button');
        heading.setAttribute('aria-expanded', 'true');

        // Heading label
        const label = document.createElement('span');
        label.className = styles.headingLabel;
        label.textContent = originalText;
        heading.textContent = '';
        heading.appendChild(label);

        // Toggle button
        const actions = document.createElement('span');
        actions.className = styles.headingActions;
        const icon = document.createElement('span');
        icon.className = styles.sectionToggle;
        icon.textContent = '▾';
        icon.setAttribute('aria-hidden', 'true');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = styles.sectionToggleBtn;
        btn.setAttribute('aria-label', `Collapse section ${originalText}`);
        btn.appendChild(icon);
        actions.appendChild(btn);
        heading.appendChild(actions);

        // Wrap following content until next h2
        const body = document.createElement('div');
        body.className = styles.sectionBody;
        let cursor = heading.nextSibling;
        while (cursor) {
          const next = cursor.nextSibling;
          if (cursor instanceof HTMLHeadingElement && cursor.tagName === 'H2') break;
          body.appendChild(cursor);
          cursor = next;
        }
        heading.parentNode?.insertBefore(body, cursor);

        const toggleSection = () => {
          const collapsed = body.style.display === 'none';
          body.style.display = collapsed ? '' : 'none';
          heading.classList.toggle(styles.collapsed, !collapsed);
          heading.setAttribute('aria-expanded', String(collapsed));
          icon.textContent = collapsed ? '▾' : '▸';
        };

        const onHeadingClick = (e: MouseEvent) => {
          if ((e.target as HTMLElement).closest('button')) return;
          jumpTo(heading.id);
        };
        const onKeydown = (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            jumpTo(heading.id);
          }
        };
        const onToggle = (e: MouseEvent) => {
          e.stopPropagation();
          toggleSection();
        };

        heading.addEventListener('click', onHeadingClick);
        heading.addEventListener('keydown', onKeydown);
        btn.addEventListener('click', onToggle);
        cleanupCallbacks.push(
          () => heading.removeEventListener('click', onHeadingClick),
          () => heading.removeEventListener('keydown', onKeydown),
          () => btn.removeEventListener('click', onToggle),
        );

        heading.dataset.collapsibleReady = 'true';
      });

      // ---- 3. Intercept ALL in-page anchor clicks (footnotes, refs, etc) ----
      //   Prevents browser default (pushState) → uses replaceState + instant jump
      const onAnchorClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        jumpTo(href.slice(1));
      };
      contentEl.addEventListener('click', onAnchorClick);
      cleanupCallbacks.push(() => contentEl.removeEventListener('click', onAnchorClick));

      // ---- 4. Build TOC entries ----
      const seen = new Set<string>();
      const parsed = Array.from(contentEl.querySelectorAll<HTMLHeadingElement>('h2, h3'))
        .map((h) => {
          if (seen.has(h.id)) return null;
          seen.add(h.id);
          return {
            id: h.id,
            text: h.dataset.tocLabel ?? h.textContent?.trim() ?? '',
            level: Number(h.tagName[1]) as 2 | 3,
          };
        })
        .filter((e): e is TocEntry => e !== null);

      setEntries(parsed);
      entriesRef.current = parsed;
    };

    // Start polling immediately
    tryInit();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanupCallbacks.forEach((fn) => fn());
    };
  }, [contentId, observeKey]);

  // ---- Active section tracking on scroll ----
  useEffect(() => {
    if (entries.length === 0) return;

    const updateActive = () => {
      const line = window.scrollY + getScrollOffset() + 2;
      let candidate = entries[0].id;
      for (const entry of entries) {
        const el = document.getElementById(entry.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top + window.scrollY <= line) {
          candidate = entry.id;
        } else {
          break;
        }
      }
      setActiveId(candidate);
    };

    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [entries]);

  if (entries.length === 0) return null;

  const onTocClick = (e: ReactMouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    jumpTo(id);
    setActiveId(id);
  };

  return (
    <div className={styles.tocBox}>
      <p className={styles.tocTitle}>Contents</p>
      <ol className={styles.tocList}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.tocItem}>
            <a
              href={`#${entry.id}`}
              onClick={(e) => onTocClick(e, entry.id)}
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
