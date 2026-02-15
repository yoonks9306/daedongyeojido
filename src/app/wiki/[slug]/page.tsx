import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { wikiArticles } from '@/data/wiki-articles';
import WikiArticle from '@/components/WikiArticle';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return wikiArticles.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = wikiArticles.find(a => a.slug === slug);
  if (!article) return { title: 'Not Found' };
  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function WikiArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = wikiArticles.find(a => a.slug === slug);
  if (!article) notFound();
  return <WikiArticle article={article} allArticles={wikiArticles} />;
}
