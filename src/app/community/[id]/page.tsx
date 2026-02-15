import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { CommunityComment, CommunityPost } from '@/types';
import CommunityDetailClient from './CommunityDetailClient';

// Always fetch fresh data (view count, comments, etc.)
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

function toPost(row: Record<string, unknown>): CommunityPost {
  return {
    id: row.id as number,
    title: row.title as string,
    content: row.content as string,
    author: row.author_name as string,
    category: row.category as CommunityPost['category'],
    upvotes: row.upvotes as number,
    views: row.views as number,
    comments: row.comment_count as number,
    createdAt: row.created_at as string,
    tags: row.tags as string[],
  };
}

function toComment(row: Record<string, unknown>): CommunityComment {
  return {
    id: row.id as number,
    postId: row.post_id as number,
    author: row.author_name as string,
    content: row.content as string,
    score: (row.score as number) ?? 0,
    createdAt: row.created_at as string,
  };
}

export default async function CommunityPostDetailPage({ params }: Props) {
  const { id } = await params;
  const postId = Number.parseInt(id, 10);
  if (!Number.isFinite(postId) || postId <= 0) {
    notFound();
  }

  // Increment view count first, then fetch (so the returned count includes this visit)
  await supabaseAdmin.rpc('increment_views', { row_id: postId });

  const { data: postRow } = await supabase
    .from('community_posts')
    .select('id, title, content, author_name, category, upvotes, views, comment_count, tags, created_at')
    .eq('id', postId)
    .single();

  if (!postRow) {
    notFound();
  }

  const { data: commentsRows } = await supabase
    .from('comments')
    .select('id, post_id, author_name, content, score, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  return (
    <CommunityDetailClient
      initialPost={toPost(postRow)}
      initialComments={(commentsRows ?? []).map(toComment)}
    />
  );
}
