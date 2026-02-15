import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import WikiArticle from '@/components/WikiArticle';
import type { WikiArticle as WikiArticleType } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

function dbToArticle(row: Record<string, unknown>): WikiArticleType {
  return {
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as WikiArticleType['category'],
    summary: row.summary as string,
    infobox: row.infobox as Record<string, string> | undefined,
    content: row.content as string,
    relatedArticles: row.related_articles as string[],
    tags: row.tags as string[],
    lastUpdated: row.last_updated as string,
  };
}

export async function generateStaticParams() {
  const { data } = await supabase.from('wiki_articles').select('slug');
  return (data ?? []).map((row) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from('wiki_articles')
    .select('title, summary')
    .eq('slug', slug)
    .single();
  if (!data) return { title: 'Not Found' };
  return {
    title: data.title,
    description: data.summary,
    openGraph: {
      title: data.title,
      description: data.summary,
      type: 'article',
      url: `/wiki/${slug}`,
      images: [
        {
          url: `/wiki/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.summary,
      images: [`/wiki/${slug}/opengraph-image`],
    },
  };
}

export default async function WikiArticlePage({ params }: Props) {
  const { slug } = await params;
  const { data: articleRow } = await supabase
    .from('wiki_articles')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!articleRow) notFound();

  const { data: allRows } = await supabase
    .from('wiki_articles')
    .select('slug, title, category, summary, related_articles, tags, last_updated, infobox, content');

  const article = dbToArticle(articleRow);
  const allArticles = (allRows ?? []).map(dbToArticle);

  return <WikiArticle article={article} allArticles={allArticles} />;
}
