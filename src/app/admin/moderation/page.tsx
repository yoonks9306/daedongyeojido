import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';
import { supabaseAdmin } from '@/lib/supabase-admin';
import ModerationQueueClient from './ModerationQueueClient';

type PendingRevisionRow = {
  id: number;
  article_id: number;
  revision_number: number;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
  summary: string | null;
  author_name: string;
  created_at: string;
};

type ArticleRef = {
  id: number;
  slug: string;
  title: string;
};

type ReportRow = {
  id: number;
  target_type: string;
  target_id: number;
  reason: string;
  detail: string | null;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
  target_label: string;
  target_link: string | null;
};

export default async function AdminModerationPage() {
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
    return (
      <main className="max-w-[960px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Forbidden</h1>
        <p className="text-muted-foreground">This page is available to moderators and admins only.</p>
      </main>
    );
  }

  const { data: pendingRows, error: pendingError } = await supabaseAdmin
    .from('wiki_revisions')
    .select('id, article_id, revision_number, status, summary, author_name, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(200);

  if (pendingError) {
    throw new Error(pendingError.message);
  }

  const pending = (pendingRows ?? []) as PendingRevisionRow[];
  const articleIds = [...new Set(pending.map((row) => row.article_id))];

  let articleMap = new Map<number, ArticleRef>();
  if (articleIds.length > 0) {
    const { data: articleRows, error: articleError } = await supabaseAdmin
      .from('wiki_articles')
      .select('id, slug, title')
      .in('id', articleIds);

    if (articleError) {
      throw new Error(articleError.message);
    }

    articleMap = new Map((articleRows ?? []).map((row) => [row.id, row as ArticleRef]));
  }

  const pendingForClient = pending.map((row) => {
    const article = articleMap.get(row.article_id);
    return {
      id: row.id,
      revision_number: row.revision_number,
      status: row.status,
      summary: row.summary,
      author_name: row.author_name,
      created_at: row.created_at,
      article_slug: article?.slug ?? 'unknown',
      article_title: article?.title ?? `Article #${row.article_id}`,
    };
  });

  const { data: reportRows, error: reportError } = await supabaseAdmin
    .from('reports')
    .select('id, target_type, target_id, reason, detail, status, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: true })
    .limit(200);

  if (reportError) {
    throw new Error(reportError.message);
  }

  const reports = (reportRows ?? []) as Omit<ReportRow, 'target_label' | 'target_link'>[];
  const articleReportIds = [...new Set(reports.filter((r) => r.target_type === 'article').map((r) => r.target_id))];
  const revisionReportIds = [...new Set(reports.filter((r) => r.target_type === 'revision').map((r) => r.target_id))];
  const postReportIds = [...new Set(reports.filter((r) => r.target_type === 'post').map((r) => r.target_id))];

  const articleById = new Map<number, ArticleRef>();
  if (articleReportIds.length > 0) {
    const { data } = await supabaseAdmin
      .from('wiki_articles')
      .select('id, slug, title')
      .in('id', articleReportIds);
    for (const row of data ?? []) {
      articleById.set(row.id, row as ArticleRef);
    }
  }

  const revisionById = new Map<number, { id: number; revision_number: number; article_id: number }>();
  if (revisionReportIds.length > 0) {
    const { data } = await supabaseAdmin
      .from('wiki_revisions')
      .select('id, revision_number, article_id')
      .in('id', revisionReportIds);
    for (const row of data ?? []) {
      revisionById.set(row.id, row as { id: number; revision_number: number; article_id: number });
    }
    const missingArticleIds = [...new Set((data ?? []).map((r) => r.article_id).filter((id) => !articleById.has(id)))];
    if (missingArticleIds.length > 0) {
      const { data: revisionArticles } = await supabaseAdmin
        .from('wiki_articles')
        .select('id, slug, title')
        .in('id', missingArticleIds);
      for (const row of revisionArticles ?? []) {
        articleById.set(row.id, row as ArticleRef);
      }
    }
  }

  const postById = new Map<number, { id: number; title: string }>();
  if (postReportIds.length > 0) {
    const { data } = await supabaseAdmin
      .from('community_posts')
      .select('id, title')
      .in('id', postReportIds);
    for (const row of data ?? []) {
      postById.set(row.id, row as { id: number; title: string });
    }
  }

  const reportsForClient: ReportRow[] = reports.map((report) => {
    if (report.target_type === 'article') {
      const article = articleById.get(report.target_id);
      return {
        ...report,
        target_label: article ? `article: ${article.title}` : `article:${report.target_id}`,
        target_link: article ? `/wiki/${article.slug}` : null,
      };
    }

    if (report.target_type === 'revision') {
      const revision = revisionById.get(report.target_id);
      const article = revision ? articleById.get(revision.article_id) : null;
      return {
        ...report,
        target_label: revision && article
          ? `revision: ${article.title} r${revision.revision_number}`
          : `revision:${report.target_id}`,
        target_link: revision && article ? `/wiki/${article.slug}?rev=${revision.revision_number}` : null,
      };
    }

    if (report.target_type === 'post') {
      const post = postById.get(report.target_id);
      return {
        ...report,
        target_label: post ? `post: ${post.title}` : `post:${report.target_id}`,
        target_link: `/community/${report.target_id}`,
      };
    }

    return {
      ...report,
      target_label: `${report.target_type}:${report.target_id}`,
      target_link: null,
    };
  });

  return (
    <ModerationQueueClient
      initialPendingRevisions={pendingForClient}
      initialOpenReports={reportsForClient}
    />
  );
}
