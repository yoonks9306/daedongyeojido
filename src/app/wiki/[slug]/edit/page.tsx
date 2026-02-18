import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import type { WikiArticle } from '@/types';
import WikiEditorForm from '../../WikiEditorForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditWikiArticlePage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    const { slug } = await params;
    redirect(`/login?callbackUrl=/wiki/${slug}/edit`);
  }

  const { slug } = await params;
  const { data } = await supabase
    .from('wiki_articles')
    .select('id, slug, title, category, summary, content, content_format, tags, related_articles')
    .eq('slug', slug)
    .single();

  if (!data) {
    notFound();
  }

  const { data: latestRevision } = await supabase
    .from('wiki_revisions')
    .select('revision_number')
    .eq('article_id', data.id)
    .order('revision_number', { ascending: false })
    .limit(1)
    .maybeSingle<{ revision_number: number }>();

  return (
    <WikiEditorForm
      mode="edit"
      slug={data.slug}
      initial={{
        title: data.title,
        category: data.category as WikiArticle['category'],
        summary: data.summary,
        content: data.content,
        contentFormat: (data.content_format ?? 'html') as 'markdown' | 'html',
        tagsText: (data.tags ?? []).join(', '),
        relatedArticlesText: (data.related_articles ?? []).join(', '),
        baseRevisionNumber: latestRevision?.revision_number ?? 0,
      }}
    />
  );
}
