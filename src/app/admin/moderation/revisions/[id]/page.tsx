import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { buildLineDiff, splitChangedLine } from '@/lib/text-diff';
import ModerationRevisionReviewClient from './ModerationRevisionReviewClient';

type Props = {
  params: Promise<{ id: string }>;
};

function toId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function listToText(values: string[] | null | undefined) {
  if (!values || values.length === 0) return '-';
  return values.join(', ');
}

export default async function ModerationRevisionReviewPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/admin/moderation');
  }

  const actorId = await ensureCommunityAuthUser(session);
  const profile = await ensureUserProfile({
    userId: actorId,
    preferredUsername: session.user.email?.split('@')[0] ?? session.user.name ?? null,
    displayName: session.user.name ?? null,
  });
  if (!isStaffRole(profile.role)) {
    redirect('/admin/moderation');
  }

  const { id: rawId } = await params;
  const revisionId = toId(rawId);
  if (!revisionId) notFound();

  const { data: revision } = await supabaseAdmin
    .from('wiki_revisions')
    .select('id, article_id, revision_number, status, author_name, created_at, content, content_format, proposed_title, proposed_category, proposed_summary, proposed_tags, proposed_related_articles')
    .eq('id', revisionId)
    .maybeSingle<{
      id: number;
      article_id: number;
      revision_number: number;
      status: 'active' | 'pending' | 'hidden' | 'deleted';
      author_name: string;
      created_at: string;
      content: string;
      content_format: 'markdown' | 'html';
      proposed_title: string | null;
      proposed_category: string | null;
      proposed_summary: string | null;
      proposed_tags: string[] | null;
      proposed_related_articles: string[] | null;
    }>();
  if (!revision) notFound();

  const { data: article } = await supabaseAdmin
    .from('wiki_articles')
    .select('slug, title, category, summary, tags, related_articles, content, content_format')
    .eq('id', revision.article_id)
    .maybeSingle<{
      slug: string;
      title: string;
      category: string;
      summary: string;
      tags: string[] | null;
      related_articles: string[] | null;
      content: string;
      content_format: 'markdown' | 'html' | null;
    }>();
  if (!article) notFound();

  const nextTitle = revision.proposed_title ?? article.title;
  const nextCategory = revision.proposed_category ?? article.category;
  const nextSummary = revision.proposed_summary ?? article.summary;
  const nextTags = revision.proposed_tags ?? article.tags ?? [];
  const nextRelated = revision.proposed_related_articles ?? article.related_articles ?? [];
  const rows = buildLineDiff(article.content, revision.content);
  const articleFormat = article.content_format ?? 'html';

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-5">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">Revision Ticket #{revision.id}</h1>
          <Link href="/admin/moderation" className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm">
            Back to Queue
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          {article.title} · r{revision.revision_number} · {revision.status} · by {revision.author_name} · {new Date(revision.created_at).toLocaleString()}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border px-2 py-0.5">Live format: {articleFormat}</span>
          <span className="rounded-full border border-border px-2 py-0.5">Pending format: {revision.content_format}</span>
          <Link href={`/wiki/${article.slug}`} className="text-primary hover:underline">Live</Link>
          <Link href={`/wiki/${article.slug}?rev=${revision.revision_number}`} className="text-primary hover:underline">Pending View</Link>
          <Link href={`/wiki/${article.slug}/raw?rev=${revision.revision_number}`} className="text-primary hover:underline">RAW</Link>
          <Link href={`/wiki/${article.slug}/blame?rev=${revision.revision_number}`} className="text-primary hover:underline">Blame</Link>
          <Link href={`/wiki/${article.slug}/history`} className="text-primary hover:underline">History</Link>
        </div>
      </header>

      <ModerationRevisionReviewClient revisionId={revision.id} />

      <section className="rounded-md border border-border p-4 bg-card space-y-3">
        <h2 className="text-lg font-semibold">Field Changes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">Title</p>
            <p className={article.title !== nextTitle ? 'bg-red-500/20 rounded px-2 py-1' : ''}>{article.title}</p>
            <p className={article.title !== nextTitle ? 'bg-green-500/20 rounded px-2 py-1' : ''}>{nextTitle}</p>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">Category</p>
            <p className={article.category !== nextCategory ? 'bg-red-500/20 rounded px-2 py-1' : ''}>{article.category}</p>
            <p className={article.category !== nextCategory ? 'bg-green-500/20 rounded px-2 py-1' : ''}>{nextCategory}</p>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">Summary</p>
            <p className={article.summary !== nextSummary ? 'bg-red-500/20 rounded px-2 py-1 whitespace-pre-wrap' : 'whitespace-pre-wrap'}>{article.summary}</p>
            <p className={article.summary !== nextSummary ? 'bg-green-500/20 rounded px-2 py-1 whitespace-pre-wrap' : 'whitespace-pre-wrap'}>{nextSummary}</p>
          </div>
          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">Tags</p>
            <p className={listToText(article.tags) !== listToText(nextTags) ? 'bg-red-500/20 rounded px-2 py-1' : ''}>{listToText(article.tags)}</p>
            <p className={listToText(article.tags) !== listToText(nextTags) ? 'bg-green-500/20 rounded px-2 py-1' : ''}>{listToText(nextTags)}</p>
          </div>
          <div className="text-sm space-y-1 md:col-span-2">
            <p className="text-muted-foreground">Related Articles</p>
            <p className={listToText(article.related_articles) !== listToText(nextRelated) ? 'bg-red-500/20 rounded px-2 py-1' : ''}>{listToText(article.related_articles)}</p>
            <p className={listToText(article.related_articles) !== listToText(nextRelated) ? 'bg-green-500/20 rounded px-2 py-1' : ''}>{listToText(nextRelated)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead className="bg-muted/50">
            <tr className="[&_th]:px-3 [&_th]:py-2 text-left">
              <th className="w-16">Live</th>
              <th>Current content</th>
              <th className="w-16">{`r${revision.revision_number}`}</th>
              <th>Pending content</th>
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
      </section>
    </main>
  );
}
