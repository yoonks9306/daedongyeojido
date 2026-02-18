import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { canViewRevision, resolveViewerContext } from '@/lib/wiki-revision-access';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ rev?: string }>;
};

export default async function WikiRawPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { rev } = await searchParams;
  const revisionNumber = Number.parseInt(rev ?? '', 10);
  if (!Number.isFinite(revisionNumber) || revisionNumber <= 0) {
    notFound();
  }

  const { data: article } = await supabaseAdmin
    .from('wiki_articles')
    .select('id, slug, title')
    .eq('slug', slug)
    .maybeSingle<{ id: number; slug: string; title: string }>();
  if (!article) notFound();

  const session = await auth();
  const viewer = await resolveViewerContext(session);

  const { data: revision } = await supabaseAdmin
    .from('wiki_revisions')
    .select('revision_number, status, author_id, content')
    .eq('article_id', article.id)
    .eq('revision_number', revisionNumber)
    .maybeSingle<{ revision_number: number; status: 'active' | 'pending' | 'hidden' | 'deleted'; author_id: string | null; content: string }>();
  if (!revision) notFound();

  const visible = canViewRevision({
    status: revision.status,
    authorId: revision.author_id,
    actorId: viewer.actorId,
    staff: viewer.staff,
  });
  if (!visible) notFound();

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-4">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-4xl font-bold">{article.title} (r{revision.revision_number} RAW)</h1>
        <div className="flex gap-2">
          <Link href={`/wiki/${slug}/edit`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">Edit</Link>
          <Link href={`/wiki/${slug}/history`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">History</Link>
          <Link href={`/wiki/${slug}`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">View</Link>
        </div>
      </header>

      <textarea
        readOnly
        value={revision.content}
        className="w-full min-h-[70vh] rounded-md border border-border bg-black/70 p-4 font-mono text-sm leading-6 text-gray-100"
      />
    </main>
  );
}
