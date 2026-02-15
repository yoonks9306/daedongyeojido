import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';

type RouteContext = { params: Promise<{ commentId: string }> };

function toId(value: string): number | null {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function POST(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { commentId: rawId } = await context.params;
  const commentId = toId(rawId);
  if (!commentId) {
    return NextResponse.json({ error: 'Invalid comment id' }, { status: 400 });
  }

  let body: { vote?: unknown };
  try {
    body = (await request.json()) as { vote?: unknown };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const vote = body.vote;
  if (vote !== 1 && vote !== -1) {
    return NextResponse.json({ error: 'vote must be 1 or -1' }, { status: 400 });
  }

  try {
    const userId = await ensureCommunityAuthUser(session);

    // Upsert: insert or update existing vote
    const { error } = await supabaseAdmin
      .from('comment_votes')
      .upsert(
        { comment_id: commentId, user_id: userId, vote },
        { onConflict: 'comment_id,user_id' }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Recalculate score
    const { data: scoreData } = await supabaseAdmin.rpc('recalculate_comment_score', { cid: commentId });
    const score = typeof scoreData === 'number' ? scoreData : 0;

    return NextResponse.json({ score, userVote: vote });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { commentId: rawId } = await context.params;
  const commentId = toId(rawId);
  if (!commentId) {
    return NextResponse.json({ error: 'Invalid comment id' }, { status: 400 });
  }

  try {
    const userId = await ensureCommunityAuthUser(session);

    await supabaseAdmin
      .from('comment_votes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    const { data: scoreData } = await supabaseAdmin.rpc('recalculate_comment_score', { cid: commentId });
    const score = typeof scoreData === 'number' ? scoreData : 0;

    return NextResponse.json({ score, userVote: 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
