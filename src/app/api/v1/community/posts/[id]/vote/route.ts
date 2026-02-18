import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';

type VoteRouteContext = {
  params: Promise<{ id: string }>;
};

function toPostId(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

async function recalculatePostVotes(postId: number): Promise<number> {
  const { count, error: countError } = await supabaseAdmin
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (countError) {
    throw new Error(countError.message);
  }

  const upvotes = count ?? 0;

  const { error: updateError } = await supabaseAdmin
    .from('community_posts')
    .update({ upvotes })
    .eq('id', postId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return upvotes;
}

export async function POST(_request: Request, context: VoteRouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const postId = toPostId(id);
  if (!postId) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }

  try {
    await assertWritesAllowed();
    const supabaseUserId = await ensureCommunityAuthUser(session);

    const { error: insertError } = await supabaseAdmin.from('votes').insert({
      user_id: supabaseUserId,
      post_id: postId,
    });

    if (insertError && insertError.code !== '23505') {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const upvotes = await recalculatePostVotes(postId);
    return NextResponse.json({ upvotes, voted: true });
  } catch (error) {
    if (error instanceof EmergencyLockError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: VoteRouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const postId = toPostId(id);
  if (!postId) {
    return NextResponse.json({ error: 'Invalid post id' }, { status: 400 });
  }

  try {
    await assertWritesAllowed();
    const supabaseUserId = await ensureCommunityAuthUser(session);

    const { error: deleteError } = await supabaseAdmin
      .from('votes')
      .delete()
      .eq('user_id', supabaseUserId)
      .eq('post_id', postId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    const upvotes = await recalculatePostVotes(postId);
    return NextResponse.json({ upvotes, voted: false });
  } catch (error) {
    if (error instanceof EmergencyLockError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
