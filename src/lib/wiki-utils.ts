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
