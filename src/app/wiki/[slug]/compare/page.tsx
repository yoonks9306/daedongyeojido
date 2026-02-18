import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { canViewRevision, resolveViewerContext } from '@/lib/wiki-revision-access';
import { buildLineDiff, splitChangedLine, type DiffRow } from '@/lib/text-diff';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ old?: string; new?: string }>;
};

type Revision = {
  revision_number: number;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
  author_id: string | null;
  content: string;
  proposed_summary?: string | null;
  proposed_tags?: string[] | null;
  proposed_related_articles?: string[] | null;
};

function parseRevisionNumber(value: string | undefined): number | null {
  const n = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function listToText(values?: string[] | null) {
  if (!values || values.length === 0) return '-';
  return values.join(', ');
}

export default async function WikiComparePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { old, new: newest } = await searchParams;
  const oldRev = parseRevisionNumber(old);
  const newRev = parseRevisionNumber(newest);
  if (!oldRev || !newRev || oldRev === newRev) {
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

  const { data: revRows } = await supabaseAdmin
    .from('wiki_revisions')
    .select('revision_number, status, author_id, content, proposed_summary, proposed_tags, proposed_related_articles')
    .eq('article_id', article.id)
    .in('revision_number', [oldRev, newRev]);

  const revisions = (revRows ?? []) as Revision[];
  const oldRow = revisions.find((r) => r.revision_number === oldRev);
  const newRow = revisions.find((r) => r.revision_number === newRev);
  if (!oldRow || !newRow) notFound();

  const oldVisible = canViewRevision({
    status: oldRow.status,
    authorId: oldRow.author_id,
    actorId: viewer.actorId,
    staff: viewer.staff,
  });
  const newVisible = canViewRevision({
    status: newRow.status,
    authorId: newRow.author_id,
    actorId: viewer.actorId,
    staff: viewer.staff,
  });
  if (!oldVisible || !newVisible) notFound();

  const rows = buildLineDiff(oldRow.content, newRow.content);
  const oldSummary = oldRow.proposed_summary ?? '-';
  const newSummary = newRow.proposed_summary ?? '-';
  const oldTagsText = listToText(oldRow.proposed_tags);
  const newTagsText = listToText(newRow.proposed_tags);
  const oldRelatedText = listToText(oldRow.proposed_related_articles);
  const newRelatedText = listToText(newRow.proposed_related_articles);

  return (
    <main className="max-w-[1260px] mx-auto px-4 py-8 space-y-4">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-4xl font-bold">{article.title} (compare)</h1>
        <div className="flex gap-2">
          <Link href={`/wiki/${slug}/history`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">History</Link>
          <Link href={`/wiki/${slug}`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">View</Link>
        </div>
      </header>

      <section className="rounded-md border border-border p-4 bg-card space-y-4">
        <h2 className="text-lg font-semibold">Field Changes</h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Summary</p>
            <p className={oldSummary !== newSummary ? 'bg-red-500/20 rounded px-2 py-1 whitespace-pre-wrap' : 'whitespace-pre-wrap'}>{oldSummary}</p>
            <p className={oldSummary !== newSummary ? 'bg-green-500/20 rounded px-2 py-1 whitespace-pre-wrap' : 'whitespace-pre-wrap'}>{newSummary}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Tags</p>
            <p className={oldTagsText !== newTagsText ? 'bg-red-500/20 rounded px-2 py-1' : ''}>{oldTagsText}</p>
            <p className={oldTagsText !== newTagsText ? 'bg-green-500/20 rounded px-2 py-1' : ''}>{newTagsText}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Related Articles</p>
            <p className={oldRelatedText !== newRelatedText ? 'bg-red-500/20 rounded px-2 py-1' : ''}>{oldRelatedText}</p>
            <p className={oldRelatedText !== newRelatedText ? 'bg-green-500/20 rounded px-2 py-1' : ''}>{newRelatedText}</p>
          </div>
        </div>
      </section>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead className="bg-muted/50">
            <tr className="[&_th]:px-3 [&_th]:py-2 text-left">
              <th className="w-16">{`r${oldRev}`}</th>
              <th>{`r${oldRev} content`}</th>
              <th className="w-16">{`r${newRev}`}</th>
              <th>{`r${newRev} content`}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const leftClass = row.type === 'removed' ? 'bg-red-500/25' : '';
              const rightClass = row.type === 'added' ? 'bg-green-500/25' : '';
              const changed = row.type === 'changed' ? splitChangedLine(row.oldLine, row.newLine) : null;
              return (
                <tr key={idx} className="border-t border-border/60 align-top">
                  <td className={`px-2 py-1 text-right text-muted-foreground ${leftClass}`}>{row.oldNo ?? ''}</td>
                  <td className={`px-2 py-1 whitespace-pre-wrap break-words ${leftClass}`}>
                    {changed ? (
                      <>
                        {changed.prefix}
                        <span className="bg-red-500/35">{changed.oldChanged}</span>
                        {changed.suffix}
                      </>
                    ) : row.oldLine}
                  </td>
                  <td className={`px-2 py-1 text-right text-muted-foreground ${rightClass}`}>{row.newNo ?? ''}</td>
                  <td className={`px-2 py-1 whitespace-pre-wrap break-words ${rightClass}`}>
                    {changed ? (
                      <>
                        {changed.prefix}
                        <span className="bg-green-500/35">{changed.newChanged}</span>
                        {changed.suffix}
                      </>
                    ) : row.newLine}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
