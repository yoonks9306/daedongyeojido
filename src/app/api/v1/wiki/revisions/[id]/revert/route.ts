import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type RevisionRow = {
  id: number;
  article_id: number;
  revision_number: number;
  content: string;
  content_format: 'markdown' | 'html';
  status: 'active' | 'pending' | 'hidden' | 'deleted';
};

function toId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export async function POST(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const revisionId = toId(rawId);
  if (!revisionId) {
    return NextResponse.json({ error: 'Invalid revision id.' }, { status: 400 });
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

  const actorId = await ensureCommunityAuthUser(session);
  const profile = await ensureUserProfile({
    userId: actorId,
    preferredUsername: session.user?.email?.split('@')[0] ?? session.user?.name ?? null,
    displayName: session.user?.name ?? null,
  });

  const { data: baseRevision, error: revisionError } = await supabaseAdmin
    .from('wiki_revisions')
    .select('id, article_id, revision_number, content, content_format, status')
    .eq('id', revisionId)
    .maybeSingle<RevisionRow>();

  if (revisionError) {
    return NextResponse.json({ error: revisionError.message }, { status: 500 });
  }
  if (!baseRevision) {
    return NextResponse.json({ error: 'Revision not found.' }, { status: 404 });
  }
  if (baseRevision.status === 'hidden' || baseRevision.status === 'deleted') {
    return NextResponse.json({ error: 'Cannot revert a hidden/deleted revision.' }, { status: 400 });
  }

  const { data: latestRevision, error: latestError } = await supabaseAdmin
    .from('wiki_revisions')
    .select('revision_number')
    .eq('article_id', baseRevision.article_id)
    .order('revision_number', { ascending: false })
    .limit(1)
    .maybeSingle<{ revision_number: number }>();

  if (latestError) {
    return NextResponse.json({ error: latestError.message }, { status: 500 });
  }

  const nextRevisionNumber = (latestRevision?.revision_number ?? 0) + 1;
  const isActive = isStaffRole(profile.role) || profile.trust_score >= 10;
  const nextStatus = isActive ? 'active' : 'pending';

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('wiki_revisions')
    .insert({
      article_id: baseRevision.article_id,
      revision_number: nextRevisionNumber,
      content: baseRevision.content,
      content_hash: createHash('sha256').update(baseRevision.content).digest('hex'),
      content_format: baseRevision.content_format,
      summary: `Revert to r${baseRevision.revision_number}`,
      author_id: actorId,
      author_name: session.user?.name ?? session.user?.email ?? actorId,
      status: nextStatus,
    })
    .select('id, revision_number, status')
    .single<{ id: number; revision_number: number; status: 'active' | 'pending' }>();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  if (!isActive) {
    return NextResponse.json({
      revisionId: inserted.id,
      revisionNumber: inserted.revision_number,
      status: 'pending',
      message: 'Revert submitted for moderation review.',
    });
  }

  const { data: article, error: updateError } = await supabaseAdmin
    .from('wiki_articles')
    .update({
      content: baseRevision.content,
      content_format: baseRevision.content_format,
      last_updated: new Date().toISOString().slice(0, 10),
    })
    .eq('id', baseRevision.article_id)
    .select('slug')
    .single<{ slug: string }>();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    revisionId: inserted.id,
    revisionNumber: inserted.revision_number,
    status: 'active',
    articleSlug: article.slug,
  });
}
