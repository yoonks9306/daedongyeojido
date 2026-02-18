import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';
import { assertWriteRateLimit, WriteRateLimitError } from '@/lib/write-rate-limit';

type CommentsRouteContext = {
  params: Promise<{ id: string }>;
};

type CreateCommentBody = {
  content?: unknown;
  anonymous?: unknown;
};

function toPostId(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

async function syncCommentCount(postId: number) {
  const { count, error: countError } = await supabaseAdmin
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (countError) {
    throw new Error(countError.message);
  }

  const { error: updateError } = await supabaseAdmin
    .from('community_posts')
    .update({ comment_count: count ?? 0 })
    .eq('id', postId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}

export async function GET(_request: Request, context: CommentsRouteContext) {
  const { id } = await context.params;
  const postId = toPostId(id);
  if (!postId) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('comments')
    .select('id, post_id, author_name, content, score, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const comments = (data ?? []).map((row) => ({
    id: row.id,
    postId: row.post_id,
    author: row.author_name,
    content: row.content,
    score: row.score ?? 0,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ comments });
}

export async function POST(request: Request, context: CommentsRouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const postId = toPostId(id);
  if (!postId) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }

  let body: CreateCommentBody;
  try {
    body = (await request.json()) as CreateCommentBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const content = typeof body.content === 'string' ? body.content.trim() : '';
  if (!content || content.length > 2000) {
    return NextResponse.json({ error: 'Comment is required and must be 2000 characters or less.' }, { status: 400 });
  }

  try {
    await assertWritesAllowed();
    const authorId = await ensureCommunityAuthUser(session);
    await assertWriteRateLimit({
      table: 'comments',
      actorColumn: 'author_id',
      actorId: authorId,
      windowSec: 600,
      max: 20,
    });
    const isAnonymous = body.anonymous === true;
    const authorName = isAnonymous
      ? 'Anonymous'
      : (session.user.name?.trim() || session.user.email?.split('@')[0] || 'Anonymous');

    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        post_id: postId,
        author_id: authorId,
        author_name: authorName,
        content,
      })
      .select('id, post_id, author_name, content, score, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await syncCommentCount(postId);

    return NextResponse.json(
      {
        comment: {
          id: data.id,
          postId: data.post_id,
          author: data.author_name,
          content: data.content,
          score: data.score ?? 0,
          createdAt: data.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof EmergencyLockError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof WriteRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
