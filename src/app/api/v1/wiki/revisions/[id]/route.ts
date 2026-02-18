import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';
import { slugifyWikiTitle } from '@/lib/wiki-utils';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type Body = {
  action?: unknown;
};

type ModerationAction = 'approve' | 'reject' | 'hide' | 'hold';

type RevisionRow = {
  id: number;
  article_id: number;
  revision_number: number;
  content: string;
  content_format: 'markdown' | 'html';
  proposed_title: string | null;
  proposed_category: string | null;
  proposed_summary: string | null;
  proposed_tags: string[] | null;
  proposed_related_articles: string[] | null;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
};

function toId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function toAction(value: unknown): ModerationAction | null {
  if (value === 'approve' || value === 'reject' || value === 'hide' || value === 'hold') {
    return value;
  }
  return null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const actorId = await ensureCommunityAuthUser(session);
  const profile = await ensureUserProfile({
    userId: actorId,
    preferredUsername: session.user?.email?.split('@')[0] ?? session.user?.name ?? null,
    displayName: session.user?.name ?? null,
  });

  if (!isStaffRole(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: rawId } = await context.params;
  const revisionId = toId(rawId);
  if (!revisionId) {
    return NextResponse.json({ error: 'Invalid revision id.' }, { status: 400 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const action = toAction(body.action);
  if (!action) {
    return NextResponse.json({ error: 'action must be one of: approve, reject, hide, hold.' }, { status: 400 });
  }

  try {
    await assertWritesAllowed();
  } catch (error) {
    if (error instanceof EmergencyLockError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { data: revision, error: revisionError } = await supabaseAdmin
    .from('wiki_revisions')
    .select('id, article_id, revision_number, content, content_format, proposed_title, proposed_category, proposed_summary, proposed_tags, proposed_related_articles, status')
    .eq('id', revisionId)
    .maybeSingle<RevisionRow>();

  if (revisionError) {
    return NextResponse.json({ error: revisionError.message }, { status: 500 });
  }
  if (!revision) {
    return NextResponse.json({ error: 'Revision not found.' }, { status: 404 });
  }

  if (action === 'hold') {
    const { error: holdError } = await supabaseAdmin
      .from('wiki_revisions')
      .update({ status: 'pending' })
      .eq('id', revision.id);

    if (holdError) {
      return NextResponse.json({ error: holdError.message }, { status: 500 });
    }

    return NextResponse.json({
      revisionId: revision.id,
      revisionNumber: revision.revision_number,
      status: 'pending',
      message: 'Revision kept in pending queue.',
    });
  }

  if (action === 'approve') {
    const { error: activateError } = await supabaseAdmin
      .from('wiki_revisions')
      .update({ status: 'active' })
      .eq('id', revision.id);

    if (activateError) {
      return NextResponse.json({ error: activateError.message }, { status: 500 });
    }

    const { data: currentArticle, error: currentArticleError } = await supabaseAdmin
      .from('wiki_articles')
      .select('id, slug, title, category, summary, tags, related_articles')
      .eq('id', revision.article_id)
      .maybeSingle<{
        id: number;
        slug: string;
        title: string;
        category: string;
        summary: string;
        tags: string[] | null;
        related_articles: string[] | null;
      }>();

    if (currentArticleError) {
      return NextResponse.json({ error: currentArticleError.message }, { status: 500 });
    }
    if (!currentArticle) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }

    const nextTitle = revision.proposed_title ?? currentArticle.title;
    const nextSlug = slugifyWikiTitle(nextTitle);
    if (!nextSlug) {
      return NextResponse.json({ error: 'Could not generate a valid slug from title.' }, { status: 400 });
    }

    const { data: article, error: articleError } = await supabaseAdmin
      .from('wiki_articles')
      .update({
        slug: nextSlug,
        title: nextTitle,
        category: revision.proposed_category ?? currentArticle.category,
        summary: revision.proposed_summary ?? currentArticle.summary,
        content: revision.content,
        content_format: revision.content_format,
        tags: revision.proposed_tags ?? currentArticle.tags ?? [],
        related_articles: revision.proposed_related_articles ?? currentArticle.related_articles ?? [],
        last_updated: new Date().toISOString().slice(0, 10),
      })
      .eq('id', revision.article_id)
      .select('slug')
      .single<{ slug: string }>();

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 });
    }

    return NextResponse.json({
      revisionId: revision.id,
      revisionNumber: revision.revision_number,
      status: 'active',
      articleSlug: article.slug,
    });
  }

  const targetStatus = action === 'hide' ? 'hidden' : 'deleted';
  const { error: updateError } = await supabaseAdmin
    .from('wiki_revisions')
    .update({ status: targetStatus })
    .eq('id', revision.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    revisionId: revision.id,
    revisionNumber: revision.revision_number,
    status: targetStatus,
  });
}
