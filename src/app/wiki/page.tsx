import { supabase } from '@/lib/supabase';
import type { WikiArticle } from '@/types';
import WikiIndexClient from './WikiIndexClient';

function dbToArticle(row: Record<string, unknown>): WikiArticle {
  return {
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as WikiArticle['category'],
    summary: row.summary as string,
    infobox: row.infobox as Record<string, string> | undefined,
    content: row.content as string,
    relatedArticles: row.related_articles as string[],
    tags: row.tags as string[],
    lastUpdated: (row.updated_at as string) ?? (row.last_updated as string),
  };
}

export default async function WikiPage() {
  const { data } = await supabase
    .from('wiki_articles')
    .select('slug, title, category, summary, tags, related_articles, last_updated, updated_at, infobox, content')
    .order('title');
  const articles = (data ?? []).map(dbToArticle);
  return <WikiIndexClient articles={articles} />;
}
