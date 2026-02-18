import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { canViewRevision, resolveViewerContext } from '@/lib/wiki-revision-access';
import HistoryListClient from './HistoryListClient';

type Props = {
  params: Promise<{ slug: string }>;
};

type Revision = {
  id: number;
  revision_number: number;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
  summary: string | null;
  author_name: string;
  author_id: string | null;
  created_at: string;
  content: string;
};

function lineDelta(prevContent: string | null, currentContent: string) {
  const prev = (prevContent ?? '').split('\n');
  const curr = currentContent.split('\n');
  const max = Math.max(prev.length, curr.length);
  let added = 0;
  let removed = 0;
  for (let i = 0; i < max; i++) {
    const a = prev[i];
    const b = curr[i];
    if (a === b) continue;
    if (a === undefined && b !== undefined) {
      added += 1;
      continue;
    }
    if (b === undefined && a !== undefined) {
      removed += 1;
      continue;
    }
    added += 1;
    removed += 1;
  }
  return { added, removed };
}

export default async function WikiHistoryPage({ params }: Props) {
  const { slug } = await params;

  const { data: article, error: articleError } = await supabaseAdmin
    .from('wiki_articles')
    .select('id, slug, title')
    .eq('slug', slug)
    .maybeSingle<{ id: number; slug: string; title: string }>();

  if (articleError) {
    throw new Error(articleError.message);
  }
  if (!article) {
    notFound();
  }

  const session = await auth();
  const viewer = await resolveViewerContext(session);

  const { data: allRevisions, error: revisionError } = await supabaseAdmin
    .from('wiki_revisions')
    .select('id, revision_number, status, summary, author_name, author_id, created_at, content')
    .eq('article_id', article.id)
    .order('revision_number', { ascending: false })
    .limit(200);

  if (revisionError) {
    throw new Error(revisionError.message);
  }

  const revisions = (allRevisions ?? []) as Revision[];
  const visibleRevisions = revisions.filter((rev) => {
    return canViewRevision({
      status: rev.status,
      authorId: rev.author_id,
      actorId: viewer.actorId,
      staff: viewer.staff,
    });
  });
  const rows = visibleRevisions.map((rev, index) => {
    const prev = visibleRevisions[index + 1] ?? null;
    const { added, removed } = lineDelta(prev?.content ?? null, rev.content);
    return {
      id: rev.id,
      revisionNumber: rev.revision_number,
      status: rev.status,
      authorName: rev.author_name,
      createdAt: rev.created_at,
      deltaAdded: added,
      deltaRemoved: removed,
    };
  });

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-6">
      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl font-bold">
            <Link href={`/wiki/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>{' '}
            <span className="text-muted-foreground">(History)</span>
          </h1>
          <div className="flex gap-2">
            <Link href={`/wiki/${article.slug}`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">
              View
            </Link>
            <Link href={`/wiki/${article.slug}/edit`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">
              Edit
            </Link>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Public users can browse history, raw, blame, compare, and revert (authenticated).
        </p>
      </header>
      <HistoryListClient slug={article.slug} rows={rows} canRevert={Boolean(session?.user)} />
    </main>
  );
}
