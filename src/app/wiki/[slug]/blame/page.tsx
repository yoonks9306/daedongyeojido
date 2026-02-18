import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { canViewRevision, resolveViewerContext } from '@/lib/wiki-revision-access';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ rev?: string }>;
};

type Revision = {
  id: number;
  revision_number: number;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
  author_id: string | null;
  author_name: string;
  content: string;
};

type BlameLine = {
  lineNo: number;
  line: string;
  revisionNumber: number;
  authorName: string;
};

function parseRev(value: string | undefined): number | null {
  const n = Number.parseInt(value ?? '', 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function buildBlame(targetRev: Revision, revisionsAsc: Revision[]): BlameLine[] {
  const targetLines = targetRev.content.split('\n');
  const targetIndex = revisionsAsc.findIndex((r) => r.revision_number === targetRev.revision_number);
  if (targetIndex < 0) return [];

  const blame: BlameLine[] = [];
  for (let i = 0; i < targetLines.length; i++) {
    let source = targetRev;
    for (let idx = targetIndex - 1; idx >= 0; idx--) {
      const prev = revisionsAsc[idx];
      const curr = revisionsAsc[idx + 1];
      const prevLine = prev.content.split('\n')[i] ?? null;
      const currLine = curr.content.split('\n')[i] ?? null;
      if (prevLine !== currLine) {
        source = curr;
        break;
      }
      if (idx === 0) {
        source = revisionsAsc[0];
      }
    }
    blame.push({
      lineNo: i + 1,
      line: targetLines[i] ?? '',
      revisionNumber: source.revision_number,
      authorName: source.author_name,
    });
  }

  return blame;
}

export default async function WikiBlamePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { rev } = await searchParams;
  const revisionNumber = parseRev(rev);
  if (!revisionNumber) notFound();

  const { data: article } = await supabaseAdmin
    .from('wiki_articles')
    .select('id, slug, title')
    .eq('slug', slug)
    .maybeSingle<{ id: number; slug: string; title: string }>();
  if (!article) notFound();

  const session = await auth();
  const viewer = await resolveViewerContext(session);

  const { data: revisionsRaw } = await supabaseAdmin
    .from('wiki_revisions')
    .select('id, revision_number, status, author_id, author_name, content')
    .eq('article_id', article.id)
    .lte('revision_number', revisionNumber)
    .order('revision_number', { ascending: true })
    .limit(400);

  const revisions = ((revisionsRaw ?? []) as Revision[]).filter((r) =>
    canViewRevision({
      status: r.status,
      authorId: r.author_id,
      actorId: viewer.actorId,
      staff: viewer.staff,
    })
  );

  const target = revisions.find((r) => r.revision_number === revisionNumber);
  if (!target) notFound();

  const lines = buildBlame(target, revisions);

  return (
    <main className="max-w-[1280px] mx-auto px-4 py-8 space-y-4">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-4xl font-bold">{article.title} (r{revisionNumber} Blame)</h1>
        <div className="flex gap-2">
          <Link href={`/wiki/${slug}/history`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">History</Link>
          <Link href={`/wiki/${slug}`} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">View</Link>
        </div>
      </header>

      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead className="bg-muted/40">
            <tr className="[&_th]:px-3 [&_th]:py-2 text-left">
              <th className="w-40">Source</th>
              <th className="w-16">#</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="border-t border-border/60 align-top">
                <td className="px-2 py-1 text-amber-500">r{line.revisionNumber} {line.authorName}</td>
                <td className="px-2 py-1 text-right text-muted-foreground">{line.lineNo}</td>
                <td className="px-2 py-1 whitespace-pre-wrap break-words">{line.line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
