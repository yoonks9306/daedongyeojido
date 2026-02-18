import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { ensureUserProfile } from '@/lib/user-profiles';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';
import { isValidWikiCategory, slugifyWikiTitle } from '@/lib/wiki-utils';

type WikiRouteContext = {
  params: Promise<{ slug: string }>;
};

type UpdateWikiBody = {
  title?: unknown;
  category?: unknown;
  summary?: unknown;
  content?: unknown;
  contentFormat?: unknown;
  tags?: unknown;
  relatedArticles?: unknown;
  baseRevisionNumber?: unknown;
};

export async function PATCH(request: Request, context: WikiRouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ error: 'Missing article slug.' }, { status: 400 });
  }

  let body: UpdateWikiBody;
  try {
    body = (await request.json()) as UpdateWikiBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const category = typeof body.category === 'string' ? body.category : '';
  const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const contentFormat = body.contentFormat === 'html' ? 'html' : 'markdown';
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean).slice(0, 20)
    : [];
  const relatedArticles = Array.isArray(body.relatedArticles)
    ? body.relatedArticles.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, 30)
    : [];
  const baseRevisionNumber = typeof body.baseRevisionNumber === 'number' && Number.isInteger(body.baseRevisionNumber)
    ? body.baseRevisionNumber
    : null;

  if (!title || title.length > 120) {
    return NextResponse.json({ error: 'Title is required and must be 120 characters or less.' }, { status: 400 });
  }
  if (!isValidWikiCategory(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
  }
  if (!summary || summary.length > 300) {
    return NextResponse.json({ error: 'Summary is required and must be 300 characters or less.' }, { status: 400 });
  }
  if (!content || content.length > 40000) {
    return NextResponse.json({ error: 'Content is required and must be 40000 characters or less.' }, { status: 400 });
  }
  if (baseRevisionNumber === null || baseRevisionNumber < 0) {
    return NextResponse.json({ error: 'baseRevisionNumber is required for optimistic locking.' }, { status: 400 });
  }

  const newSlug = slugifyWikiTitle(title);
  if (!newSlug) {
    return NextResponse.json({ error: 'Could not generate a valid slug from title.' }, { status: 400 });
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

  try {
    const actorId = await ensureCommunityAuthUser(session);
    const profile = await ensureUserProfile({
      userId: actorId,
      preferredUsername: session.user?.email?.split('@')[0] ?? session.user?.name ?? null,
      displayName: session.user?.name ?? null,
    });

    const { data: article, error: articleError } = await supabaseAdmin
      .from('wiki_articles')
      .select('id, slug')
      .eq('slug', slug)
      .maybeSingle<{ id: number; slug: string }>();

    if (articleError) {
      return NextResponse.json({ error: articleError.message }, { status: 500 });
    }
    if (!article) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }

    const { data: revisionRow, error: revisionLookupError } = await supabaseAdmin
      .from('wiki_revisions')
      .select('revision_number')
      .eq('article_id', article.id)
      .order('revision_number', { ascending: false })
      .limit(1)
      .maybeSingle<{ revision_number: number }>();

    if (revisionLookupError) {
      return NextResponse.json({ error: revisionLookupError.message }, { status: 500 });
    }

    const currentRevisionNumber = revisionRow?.revision_number ?? 0;
    if (baseRevisionNumber !== currentRevisionNumber) {
      return NextResponse.json({
        error: 'Revision conflict: document has changed since you opened the editor.',
        currentRevisionNumber,
      }, { status: 409 });
    }

    const nextRevisionNumber = currentRevisionNumber + 1;
    const isActive = profile.role === 'admin' || profile.role === 'moderator' || profile.trust_score >= 10;
    const revisionStatus = isActive ? 'active' : 'pending';

    const { error: revisionInsertError } = await supabaseAdmin
      .from('wiki_revisions')
      .insert({
        article_id: article.id,
        revision_number: nextRevisionNumber,
        content,
        content_hash: createHash('sha256').update(content).digest('hex'),
        content_format: contentFormat,
        summary: 'Wiki article update',
        proposed_title: title,
        proposed_category: category,
        proposed_summary: summary,
        proposed_tags: tags,
        proposed_related_articles: relatedArticles,
        author_id: actorId,
        author_name: session.user?.name ?? session.user?.email ?? actorId,
        status: revisionStatus,
      });

    if (revisionInsertError) {
      return NextResponse.json({ error: revisionInsertError.message }, { status: 500 });
    }

    if (!isActive) {
      return NextResponse.json({
        slug: article.slug,
        revisionNumber: nextRevisionNumber,
        status: 'pending',
        message: 'Revision submitted for moderation review.',
      });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('wiki_articles')
      .update({
        slug: newSlug,
        title,
        category,
        summary,
        content,
        content_format: contentFormat,
        tags,
        related_articles: relatedArticles,
        last_updated: new Date().toISOString().slice(0, 10),
      })
      .eq('id', article.id)
      .select('slug')
      .single<{ slug: string }>();

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json({ error: 'An article with that slug already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      slug: updated.slug,
      revisionNumber: nextRevisionNumber,
      status: 'active',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
