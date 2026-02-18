import type { WikiArticle } from '@/types';
import { marked } from 'marked';

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

type EmbedSize = 'small' | 'medium' | 'large';
type EmbedAlign = 'left' | 'center' | 'right';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceWikiLinks(text: string): string {
  return text
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_m, slug, label) => {
      const cleanSlug = slugifyWikiTitle(String(slug));
      return `[${String(label).trim()}](/wiki/${cleanSlug})`;
    })
    .replace(/\[\[([^\]]+)\]\]/g, (_m, slug) => {
      const cleanSlug = slugifyWikiTitle(String(slug));
      return `[${String(slug).trim()}](/wiki/${cleanSlug})`;
    });
}

function transformInfoboxBlocks(source: string): string {
  return source.replace(/::infobox\s*\n([\s\S]*?)\n::/g, (_match, rawBody: string) => {
    const lines = rawBody
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) return '';

    const map = new Map<string, string>();
    for (const line of lines) {
      const idx = line.indexOf(':');
      if (idx <= 0) continue;
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      if (!value) continue;
      map.set(key, value);
    }

    const title = map.get('title') ?? map.get('name') ?? '';
    const image = map.get('image') ?? '';
    const caption = map.get('caption') ?? '';
    const size = map.get('size') === 'small' || map.get('size') === 'large' ? map.get('size') : 'medium';
    const align = map.get('align') === 'left' || map.get('align') === 'right' ? map.get('align') : 'right';

    const hiddenKeys = new Set(['title', 'name', 'image', 'caption', 'size', 'align']);
    const rows = Array.from(map.entries())
      .filter(([key]) => !hiddenKeys.has(key))
      .map(([key, value]) => {
        const keyText = escapeHtml(key);
        const valueHtml = marked.parseInline(replaceWikiLinks(value), { gfm: true, breaks: true }) as string;
        return `<tr><th>${keyText}</th><td>${valueHtml}</td></tr>`;
      })
      .join('');

    const titleHtml = title ? `<div class="wiki-infobox-title">${escapeHtml(title)}</div>` : '';
    const imageHtml = image
      ? `<div class="wiki-infobox-image"><img src="${escapeHtml(image)}" alt="${escapeHtml(title || 'infobox image')}" />${caption ? `<p class="wiki-infobox-caption">${escapeHtml(caption)}</p>` : ''}</div>`
      : '';
    const tableHtml = rows ? `<table class="wiki-infobox-table"><tbody>${rows}</tbody></table>` : '';

    return `<aside class="wiki-infobox wiki-infobox-size-${size} wiki-infobox-align-${align}">${titleHtml}${imageHtml}${tableHtml}</aside>`;
  });
}

function parseYouTubeEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    let id = '';
    if (url.hostname.includes('youtu.be')) {
      id = url.pathname.replace('/', '').trim();
    } else if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') {
        id = url.searchParams.get('v') ?? '';
      } else if (url.pathname.startsWith('/shorts/')) {
        id = url.pathname.split('/').filter(Boolean)[1] ?? '';
      } else if (url.pathname.startsWith('/embed/')) {
        id = url.pathname.split('/').filter(Boolean)[1] ?? '';
      }
    }
    id = id.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return null;
  }
}

function parseMapEmbedUrl(raw: string): string {
  try {
    const url = new URL(raw);
    const q = url.searchParams.get('q');
    if (q?.trim()) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q.trim())}&output=embed`;
    }
    return `https://www.google.com/maps?q=${encodeURIComponent(raw)}&output=embed`;
  } catch {
    return `https://www.google.com/maps?q=${encodeURIComponent(raw)}&output=embed`;
  }
}

function parseEmbedLabel(rawText: string, base: 'YouTube' | 'Google Map'): { size: EmbedSize; align: EmbedAlign } {
  const tokens = rawText.split('|').map((x) => x.trim()).filter(Boolean);
  if (!tokens.length || tokens[0] !== base) {
    return { size: 'medium', align: 'center' };
  }
  const size = (tokens.find((x) => x === 'small' || x === 'medium' || x === 'large') as EmbedSize | undefined) ?? 'medium';
  const align = (tokens.find((x) => x === 'left' || x === 'center' || x === 'right') as EmbedAlign | undefined) ?? 'center';
  return { size, align };
}

export function markdownToHtml(markdown: string): string {
  const normalized = markdown.replace(/\r\n/g, '\n');

  const withInfobox = transformInfoboxBlocks(normalized);
  const preprocessed = replaceWikiLinks(withInfobox);

  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const renderer = new marked.Renderer();
  const originalLink = renderer.link.bind(renderer);
  renderer.link = (token) => {
    const href = token.href ?? '';
    const text = token.text ?? '';
    if (text.startsWith('YouTube') && href) {
      const { size, align } = parseEmbedLabel(text, 'YouTube');
      const embed = parseYouTubeEmbedUrl(href);
      if (embed) {
        return `<div class="wiki-embed wiki-embed-youtube wiki-embed-size-${size} wiki-embed-align-${align}"><iframe src="${embed}" title="YouTube video" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
      }
    }
    if (text.startsWith('Google Map') && href) {
      const { size, align } = parseEmbedLabel(text, 'Google Map');
      const embed = parseMapEmbedUrl(href);
      return `<div class="wiki-embed wiki-embed-map wiki-embed-size-${size} wiki-embed-align-${align}"><iframe src="${embed}" title="Google map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`;
    }
    return originalLink(token);
  };

  return marked.parse(preprocessed, { renderer }) as string;
}

export function parseWikiContent(rawContent: string, contentFormat: 'markdown' | 'html' = 'html'): ParsedWikiContent {
  const toc: TocEntry[] = [];
  let h2Count = 0;
  let h3Count = 0;
  const rawHtml = contentFormat === 'markdown' ? markdownToHtml(rawContent) : rawContent;

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
