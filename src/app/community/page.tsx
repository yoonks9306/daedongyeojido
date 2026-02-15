import { supabase } from '@/lib/supabase';
import type { CommunityPost } from '@/types';
import CommunityClient from './CommunityClient';

// Force dynamic rendering so views/comments are always fresh
export const dynamic = 'force-dynamic';

function dbToPost(row: Record<string, unknown>): CommunityPost {
  return {
    id: row.id as number,
    title: row.title as string,
    content: row.content as string,
    author: row.author_name as string,
    category: row.category as CommunityPost['category'],
    upvotes: row.upvotes as number,
    views: row.views as number,
    comments: row.comment_count as number,
    createdAt: (row.created_at as string).split('T')[0],
    tags: row.tags as string[],
  };
}

export default async function CommunityPage() {
  // Fetch posts with actual comment count from comments table
  const { data } = await supabase
    .from('community_posts')
    .select('id, title, content, author_name, category, upvotes, views, tags, created_at, comments(count)')
    .order('created_at', { ascending: false });

  const posts = (data ?? []).map((row: Record<string, unknown>) => {
    const commentsAgg = row.comments as { count: number }[] | undefined;
    const commentCount = commentsAgg?.[0]?.count ?? 0;
    return {
      id: row.id as number,
      title: row.title as string,
      content: row.content as string,
      author: row.author_name as string,
      category: row.category as CommunityPost['category'],
      upvotes: row.upvotes as number,
      views: row.views as number,
      comments: commentCount,
      createdAt: (row.created_at as string).split('T')[0],
      tags: row.tags as string[],
    };
  });

  return <CommunityClient posts={posts} />;
}
