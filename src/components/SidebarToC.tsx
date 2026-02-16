'use client';

import { useEffect, useState } from 'react';
import styles from './WikiArticle.module.css';
import type { TocEntry } from '@/lib/wiki-utils';

interface SidebarToCProps {
  contentId: string;
  initialEntries: TocEntry[];
}

/** Compute scroll offset from CSS custom properties (nav + ad banner + padding). */
function getScrollOffset(): number {
  if (typeof window === 'undefined') return 180; // Fallback
  // Namu layout: Fixed Nav (56px) + Fixed/Sticky Ad (106px) + Padding (16px) = ~178px
  // We'll use a safer 180px or read from CSS if possible, but hardcoding for stability is fine given the request.
  const root = getComputedStyle(document.documentElement);
  const nav = Number.parseInt(root.getPropertyValue('--nav-height'), 10) || 56;
  const ad = Number.parseInt(root.getPropertyValue('--ad-banner-height'), 10) || 106;
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

export default function SidebarToC({ contentId, initialEntries }: SidebarToCProps) {
  // No active section tracking needed as per user request.
  // "CONTENTS 에서 스크롤 내리면 지금 내가 보고있는 페이지의 섹션 번호가 빨갛게 하이라이트되는 규칙이 있는데 그거 걍 없애주셈"

  // ---- Enrichment: Bind click handlers to server-rendered Namu spans ----
  useEffect(() => {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;

    const cleanupCallbacks: Array<() => void> = [];

    // 1. Intercept ALL in-page anchor clicks (footnotes, refs, #toc)
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const targetId = href.slice(1); // remove '#'

      if (targetId === 'toc') {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        history.replaceState(null, '', '#toc');
      } else {
        jumpTo(targetId);
      }
    };
    contentEl.addEventListener('click', onAnchorClick);
    cleanupCallbacks.push(() => contentEl.removeEventListener('click', onAnchorClick));

    // 2. Bind handlers for Namu-style interactive elements
    const onContentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Case A: Click Number -> Jump to TOC
      if (target.closest('.namu-wiki-num') || (target.dataset && target.dataset.link === 'toc')) {
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        history.replaceState(null, '', '#toc');
        return;
      }

      // Case B: Click Content Wrapper -> Collapse/Expand Section
      const wrapper = target.closest('.namu-wiki-content-wrapper');
      if (wrapper) {
        // If user clicked a Link inside the text, let it navigate.
        if (target.tagName === 'A' || target.closest('a')) {
          return;
        }

        e.stopPropagation();

        const heading = wrapper.closest('h2, h3') as HTMLElement;
        if (!heading) return;

        // Toggle Logic
        const toggleSpan = wrapper.querySelector('.namu-wiki-toggle') as HTMLElement;

        // Check if already wrapped
        if (heading.dataset.wrapped === 'true') {
          const sectionDiv = heading.nextElementSibling as HTMLElement;
          if (sectionDiv && sectionDiv.classList.contains(styles.sectionBody)) {
            const isHidden = sectionDiv.style.display === 'none';
            sectionDiv.style.display = isHidden ? 'block' : 'none';

            // Rotate Icon: Default (Open) = 0deg, Closed = -90deg (Right)
            if (toggleSpan) {
              toggleSpan.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
            }
          }
          return;
        }

        // Lazy Wrapping Logic (First Interaction)
        const bodyNodes: Node[] = [];
        let cursor = heading.nextSibling;
        while (cursor) {
          const next = cursor.nextSibling;
          if (cursor instanceof Element && (cursor.tagName === 'H2' || (heading.tagName === 'H3' && cursor.tagName === 'H3'))) {
            if (heading.tagName === 'H2' && cursor.tagName === 'H2') break;
            if (heading.tagName === 'H3' && (cursor.tagName === 'H3' || cursor.tagName === 'H2')) break;
            break;
          }
          bodyNodes.push(cursor);
          cursor = next;
        }

        const sectionDiv = document.createElement('div');
        sectionDiv.className = styles.sectionBody;
        bodyNodes.forEach(node => sectionDiv.appendChild(node));
        heading.parentNode?.insertBefore(sectionDiv, heading.nextSibling);

        // Initial toggle state -> HIDE (User clicked to collapse)
        sectionDiv.style.display = 'none';
        if (toggleSpan) {
          toggleSpan.style.transform = 'rotate(-90deg)';
        }
        heading.dataset.wrapped = 'true';
      }
    };
    contentEl.addEventListener('click', onContentClick);
    cleanupCallbacks.push(() => contentEl.removeEventListener('click', onContentClick));

    return () => {
      cleanupCallbacks.forEach(fn => fn());
    };
  }, [contentId]);

  if (initialEntries.length === 0) return null;

  const onTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    jumpTo(id);
  };

  return (
    <div className={styles.tocBox} id="toc">
      <p className={styles.tocTitle}>Contents</p>
      <ol className={styles.tocList}>
        {initialEntries.map((entry) => (
          <li key={entry.id} className={`${styles.tocItem} ${entry.level === 3 ? styles.tocItemH3 : ''}`}>
            <div className={styles.tocEntryRow}>
              <a
                href={`#${entry.id}`}
                onClick={(e) => onTocClick(e, entry.id)}
                className={styles.tocNumLink}
              >
                {entry.number}
              </a>
              <span className={styles.tocTextLabel}>
                {entry.text}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
