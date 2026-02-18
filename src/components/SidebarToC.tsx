'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TocEntry } from '@/lib/wiki-utils';

interface SidebarToCProps {
  contentId: string;
  initialEntries: TocEntry[];
}

function getScrollOffset(): number {
  if (typeof window === 'undefined') return 180;
  const root = getComputedStyle(document.documentElement);
  const nav = Number.parseInt(root.getPropertyValue('--nav-height'), 10) || 56;
  const ad = Number.parseInt(root.getPropertyValue('--ad-banner-height'), 10) || 106;
  return nav + ad + 16;
}

function jumpTo(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const y = target.getBoundingClientRect().top + window.scrollY - getScrollOffset();
  window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  history.replaceState(null, '', `#${id}`);
}

export default function SidebarToC({ contentId, initialEntries }: SidebarToCProps) {
  useEffect(() => {
    const contentEl = document.getElementById(contentId);
    if (!contentEl) return;

    const cleanupCallbacks: Array<() => void> = [];

    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const targetId = href.slice(1);

      if (targetId === 'toc') {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        history.replaceState(null, '', '#toc');
      } else {
        jumpTo(targetId);
      }
    };
    contentEl.addEventListener('click', onAnchorClick);
    cleanupCallbacks.push(() => contentEl.removeEventListener('click', onAnchorClick));

    const onContentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest('.namu-wiki-num') || (target.dataset && target.dataset.link === 'toc')) {
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        history.replaceState(null, '', '#toc');
        return;
      }

      const wrapper = target.closest('.namu-wiki-content-wrapper');
      if (wrapper) {
        if (target.tagName === 'A' || target.closest('a')) {
          return;
        }

        e.stopPropagation();

        const heading = wrapper.closest('h2, h3') as HTMLElement;
        if (!heading) return;

        const toggleSpan = wrapper.querySelector('.namu-wiki-toggle') as HTMLElement;

        if (heading.dataset.wrapped === 'true') {
          const sectionDiv = heading.nextElementSibling as HTMLElement;
          if (sectionDiv && sectionDiv.classList.contains('wiki-section-body')) {
            const isHidden = sectionDiv.style.display === 'none';
            sectionDiv.style.display = isHidden ? 'block' : 'none';

            if (toggleSpan) {
              toggleSpan.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(-90deg)';
            }
          }
          return;
        }

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
        sectionDiv.className = 'wiki-section-body';
        bodyNodes.forEach(node => sectionDiv.appendChild(node));
        heading.parentNode?.insertBefore(sectionDiv, heading.nextSibling);

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
    <div className="bg-card dark:bg-surface border border-border rounded-sm p-4" id="toc">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 pb-2 border-b border-border">Contents</p>
      <ol className="list-none p-0 m-0">
        {initialEntries.map((entry) => (
          <li key={entry.id} className={cn('mb-0.5', entry.level === 3 && 'pl-5')}>
            <div className="flex items-baseline gap-1.5 py-0.5 leading-snug">
              <a
                href={`#${entry.id}`}
                onClick={(e) => onTocClick(e, entry.id)}
                className="text-primary text-sm font-medium no-underline shrink-0 hover:underline"
              >
                {entry.number}
              </a>
              <span className="text-foreground text-sm">
                {entry.text}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
