import type { WikiArticle } from '@/types';

export const WIKI_CATEGORIES: WikiArticle['category'][] = [
  'Transport',
  'Apps',
  'Food',
  'Culture',
  'Places',
  'Practical',
];

export function isValidWikiCategory(value: string): value is WikiArticle['category'] {
  return WIKI_CATEGORIES.includes(value as WikiArticle['category']);
}

export function slugifyWikiTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Parses raw HTML content to:
 * 1. Generate a Table of Contents (TOC) with Namu Wiki style IDs (s-1, s-1.1)
 * 2. Return structured TOC data with explicit numbering strings
 * 3. Inject interactive spans into the HTML for Namu-style UX
 */
export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
  number: string; // e.g., "1.", "1.1."
}

export interface ParsedWikiContent {
  processedContent: string;
  toc: TocEntry[];
}

export function parseWikiContent(rawHtml: string): ParsedWikiContent {
  const toc: TocEntry[] = [];
  let h2Count = 0;
  let h3Count = 0;

  // Namu-style parsing:
  // 1. Generate s-1, s-1.1 IDs
  // 2. Extract TOC with explicit numbering
  // 3. Inject interactive spans (number link + text toggle)
  const processedContent = rawHtml.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, levelStr, attrs, content) => {
    const level = parseInt(levelStr, 10) as 2 | 3;
    const cleanText = content.replace(/<[^>]+>/g, '').trim();

    let id = '';
    let numberFn = ''; // e.g. "1." or "1.1."

    if (level === 2) {
      h2Count++;
      h3Count = 0;
      id = `s-${h2Count}`;
      numberFn = `${h2Count}.`;
    } else {
      id = `s-${h2Count}.${++h3Count}`;
      numberFn = `${h2Count}.${h3Count}.`;
    }

    toc.push({ id, text: cleanText, level, number: numberFn });

    // Inject Namu-style interactive spans
    // Layout: [Num] [TitleWrapper (flex-1)] [Icon (margin-left:auto)]
    return `
      <h${level} id="${id}" class="namu-wiki-heading" ${attrs}>
        <span class="namu-wiki-num" data-link="toc" title="Go to Table of Contents">${numberFn}</span>
        <div class="namu-wiki-content-wrapper" data-toggle="section" title="Toggle Section">
            <span class="namu-wiki-text">${content.trim()}</span>
            <span class="namu-wiki-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
        </div>
      </h${level}>
    `.trim();
  });

  return { processedContent, toc };
}
