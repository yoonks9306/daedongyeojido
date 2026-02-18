import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';
import { assertWriteRateLimit, WriteRateLimitError } from '@/lib/write-rate-limit';

const VALID_CATEGORIES = new Set(['review', 'question', 'free', 'tip']);

type CreatePostBody = {
  title?: unknown;
  content?: unknown;
  category?: unknown;
  tags?: unknown;
  anonymous?: unknown;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: CreatePostBody;
  try {
    body = (await request.json()) as CreatePostBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const category = typeof body.category === 'string' ? body.category : '';
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean).slice(0, 10)
    : [];

  if (!title || title.length > 120) {
    return NextResponse.json({ error: 'Title is required and must be 120 characters or less.' }, { status: 400 });
  }
  if (!content || content.length > 4000) {
    return NextResponse.json({ error: 'Content is required and must be 4000 characters or less.' }, { status: 400 });
  }
  if (!VALID_CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
  }

  try {
    await assertWritesAllowed();
    const supabaseUserId = await ensureCommunityAuthUser(session);
    await assertWriteRateLimit({
      table: 'community_posts',
      actorColumn: 'author_id',
      actorId: supabaseUserId,
      windowSec: 600,
      max: 5,
    });
    const isAnonymous = body.anonymous === true;
    const authorName = isAnonymous
      ? 'Anonymous'
      : (session.user.name?.trim() || session.user.email?.split('@')[0] || 'Anonymous');

    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .insert({
        title,
        content,
        category,
        tags,
        author_id: supabaseUserId,
        author_name: authorName,
        upvotes: 0,
        views: 0,
        comment_count: 0,
      })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
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
