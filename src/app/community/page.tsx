import { supabase } from '@/lib/supabase';
import type { CommunityPost } from '@/types';
import CommunityClient from './CommunityClient';

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
  const { data } = await supabase
    .from('community_posts')
    .select('id, title, content, author_name, category, upvotes, views, comment_count, tags, created_at')
    .order('created_at', { ascending: false });
  const posts = (data ?? []).map(dbToPost);
  return <CommunityClient posts={posts} />;
}
