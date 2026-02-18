import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import WikiArticle from '@/components/WikiArticle';
import type { WikiArticle as WikiArticleType } from '@/types';
import { canViewRevision, resolveViewerContext } from '@/lib/wiki-revision-access';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ rev?: string }>;
}

function dbToArticle(row: Record<string, unknown>): WikiArticleType {
  return {
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as WikiArticleType['category'],
    summary: row.summary as string,
    infobox: row.infobox as Record<string, string> | undefined,
    content: row.content as string,
    contentFormat: ((row.content_format as string | null) ?? 'html') as 'markdown' | 'html',
    relatedArticles: row.related_articles as string[],
    tags: row.tags as string[],
    lastUpdated: (row.updated_at as string) ?? (row.last_updated as string),
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

export default async function WikiArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { rev } = await searchParams;
  const { data: articleRow } = await supabase
    .from('wiki_articles')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!articleRow) notFound();

  const { data: allRows } = await supabase
    .from('wiki_articles')
    .select('slug, title, category, summary, related_articles, tags, last_updated, infobox, content, content_format');

  const article = dbToArticle(articleRow);
  const allArticles = (allRows ?? []).map(dbToArticle);

  let viewingRevisionNumber: number | null = null;
  let latestRevisionNumber: number | null = null;

  if (rev) {
    const revisionNumber = Number.parseInt(rev, 10);
    if (!Number.isFinite(revisionNumber) || revisionNumber <= 0) {
      notFound();
    }

    const session = await auth();
    const viewer = await resolveViewerContext(session);

    const { data: latestRevision } = await supabaseAdmin
      .from('wiki_revisions')
      .select('revision_number')
      .eq('article_id', articleRow.id as number)
      .order('revision_number', { ascending: false })
      .limit(1)
      .maybeSingle<{ revision_number: number }>();

    latestRevisionNumber = latestRevision?.revision_number ?? null;

    const { data: targetRevision } = await supabaseAdmin
      .from('wiki_revisions')
      .select('revision_number, status, author_id, content, content_format')
      .eq('article_id', articleRow.id as number)
      .eq('revision_number', revisionNumber)
      .maybeSingle<{ revision_number: number; status: 'active' | 'pending' | 'hidden' | 'deleted'; author_id: string | null; content: string; content_format: 'markdown' | 'html' | null }>();

    if (!targetRevision) {
      notFound();
    }

    const visible = canViewRevision({
      status: targetRevision.status,
      authorId: targetRevision.author_id,
      actorId: viewer.actorId,
      staff: viewer.staff,
    });
    if (!visible) {
      notFound();
    }

    article.content = targetRevision.content;
    article.contentFormat = targetRevision.content_format ?? article.contentFormat ?? 'html';
    viewingRevisionNumber = targetRevision.revision_number;
  }

  return (
    <WikiArticle
      article={article}
      allArticles={allArticles}
      viewingRevisionNumber={viewingRevisionNumber}
      latestRevisionNumber={latestRevisionNumber}
    />
  );
}
