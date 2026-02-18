'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import type { CommunityPost } from '@/types';
import { cn } from '@/lib/utils';

type Tab = 'all' | 'daily' | 'weekly' | 'monthly';

const ADMIN_EMAILS = ['yoonks9306@gmail.com'];

const TABS: { key: Tab; label: string }[] = [
  { key: 'all',     label: 'All Posts' },
  { key: 'daily',   label: 'Daily Best' },
  { key: 'weekly',  label: 'Weekly Best' },
  { key: 'monthly', label: 'Monthly Best' },
];

const CAT_LABELS: Record<string, string> = {
  review:   'Review',
  question: 'Question',
  free:     'Free Talk',
  tip:      'Tip',
};

const CAT_STYLES: Record<string, string> = {
  review: 'bg-[#e8f5e9] text-[#2e7d32] dark:bg-[#1b3a1e] dark:text-[#66bb6a]',
  question: 'bg-[#e3f2fd] text-[#1565c0] dark:bg-[#1a2a3a] dark:text-[#64b5f6]',
  free: 'bg-[#fce4ec] text-[#880e4f] dark:bg-[#3a1a2a] dark:text-[#f48fb1]',
  tip: 'bg-[#fff8e1] text-[#f57f17] dark:bg-[#3a3010] dark:text-[#ffd54f]',
};

const RECENCY_MS: Record<Tab, number> = {
  all:     Infinity,
  daily:   24 * 60 * 60 * 1000,
  weekly:  7 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

function scorePost(post: CommunityPost, tab: Exclude<Tab, 'all'>): number {
  const windowMs = RECENCY_MS[tab];
  const ageMs = Math.max(Date.now() - new Date(post.createdAt).getTime(), 0);
  const boundedAge = Math.min(ageMs, windowMs);
  const recencyWeight = 1 + (1 - boundedAge / windowMs) * 0.5;
  return post.upvotes * recencyWeight;
}

function getPostsForTab(posts: CommunityPost[], tab: Tab): CommunityPost[] {
  if (tab === 'all') return posts;
  const cutoff = Date.now() - RECENCY_MS[tab];
  const inWindow = posts.filter(p => new Date(p.createdAt).getTime() >= cutoff);
  const pool = inWindow.length > 0 ? inWindow : posts;
  return [...pool]
    .sort((a, b) => scorePost(b, tab) - scorePost(a, tab) || b.upvotes - a.upvotes)
    .slice(0, tab === 'daily' ? 5 : tab === 'weekly' ? 10 : pool.length);
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
}

export default function CommunityClient({ posts }: { posts: CommunityPost[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [upvotesByPost, setUpvotesByPost] = useState<Record<number, number>>({});
  const [votedPosts, setVotedPosts] = useState<Record<number, boolean>>({});
  const [loadingVote, setLoadingVote] = useState<Record<number, boolean>>({});
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [voteError, setVoteError] = useState<string | null>(null);

  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email ?? '');

  const resolvedPosts = useMemo(
    () => posts
      .filter((p) => !deletedIds.has(p.id))
      .map((post) => ({ ...post, upvotes: upvotesByPost[post.id] ?? post.upvotes })),
    [posts, upvotesByPost, deletedIds]
  );

  const displayPosts = getPostsForTab(resolvedPosts, activeTab);

  async function handleVote(postId: number) {
    if (!session?.user) {
      router.push('/login?callbackUrl=/community');
      return;
    }

    if (loadingVote[postId]) return;

    const alreadyVoted = Boolean(votedPosts[postId]);
    setVoteError(null);
    setLoadingVote((prev) => ({ ...prev, [postId]: true }));

    try {
      const response = await fetch(`/api/v1/community/posts/${postId}/vote`, {
        method: alreadyVoted ? 'DELETE' : 'POST',
      });
      const payload = (await response.json()) as { upvotes?: number; voted?: boolean; error?: string };

      if (!response.ok || typeof payload.upvotes !== 'number' || typeof payload.voted !== 'boolean') {
        throw new Error(payload.error ?? 'Failed to update vote.');
      }

      setUpvotesByPost((prev) => ({ ...prev, [postId]: payload.upvotes as number }));
      setVotedPosts((prev) => ({ ...prev, [postId]: payload.voted as boolean }));
    } catch (error) {
      setVoteError(error instanceof Error ? error.message : 'Failed to update vote.');
    } finally {
      setLoadingVote((prev) => ({ ...prev, [postId]: false }));
    }
  }

  async function handleDelete(postId: number) {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/v1/community/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setDeletedIds((prev) => new Set(prev).add(postId));
      }
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 pt-6 max-md:px-4">
      <div className="flex justify-between items-center gap-3 mb-2 max-md:items-start">
        <h1 className="text-3xl font-bold flex items-baseline gap-3 flex-wrap">
          Community
          <span className="text-base font-normal text-muted-foreground">
            — Reviews, Questions &amp; Free Talk
          </span>
        </h1>
        <Link href="/community/new" className="inline-flex items-center justify-center py-2 px-3 border border-primary rounded-sm bg-primary text-primary-foreground no-underline text-sm font-medium">Write Post</Link>
      </div>

      {voteError && <p className="text-destructive text-sm mb-3">{voteError}</p>}

      <div className="flex border-b-2 border-border mb-6" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={cn(
              'py-2 px-5 text-sm font-medium text-muted-foreground cursor-pointer bg-transparent border-none border-b-[3px] border-transparent -mb-[2px] transition-colors font-sans',
              activeTab === tab.key && 'text-primary border-b-primary font-semibold',
              activeTab !== tab.key && 'hover:text-foreground'
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className="list-none p-0 m-0 border border-border rounded-sm overflow-hidden" role="list">
        {displayPosts.map(post => (
          <li
            key={post.id}
            className="grid grid-cols-[48px_1fr] gap-4 items-center py-3 px-4 border-b border-border/50 last:border-b-0 transition-colors hover:bg-card dark:hover:bg-surface cursor-pointer max-md:grid-cols-[40px_1fr]"
            onClick={() => router.push(`/community/${post.id}`)}
          >
            <div className="flex flex-col items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                className={cn(
                  'w-8 h-7 flex items-center justify-center border border-border rounded-sm bg-card dark:bg-surface text-muted-foreground cursor-pointer text-sm leading-none transition-colors',
                  votedPosts[post.id] && 'bg-primary/15 text-primary border-primary',
                  !votedPosts[post.id] && 'hover:bg-primary/15 hover:text-primary hover:border-primary'
                )}
                aria-label={votedPosts[post.id] ? 'Remove upvote' : 'Upvote'}
                onClick={() => { void handleVote(post.id); }}
                disabled={Boolean(loadingVote[post.id])}
              >
                ▲
              </button>
              <span className="text-sm font-semibold text-foreground min-w-5 text-center">{post.upvotes}</span>
            </div>

            <div className="min-w-0">
              <span className="inline-block text-base font-medium text-foreground mb-1 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer no-underline hover:text-primary">
                {post.title}
              </span>
              <div className="flex gap-3 items-center text-xs text-muted-foreground flex-wrap">
                <span className={cn('inline-block py-[0.1em] px-2 rounded-full text-[0.65rem] font-semibold uppercase tracking-wide', CAT_STYLES[post.category])}>
                  {CAT_LABELS[post.category]}
                </span>
                <span>{post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="inline-flex items-center gap-[3px] [&_svg]:opacity-60"><CommentIcon /> {post.comments}</span>
                <span className="inline-flex items-center gap-[3px] [&_svg]:opacity-60"><ViewIcon /> {post.views.toLocaleString()}</span>
                {isAdmin && (
                  <button
                    className="inline-flex items-center bg-transparent border-none cursor-pointer text-muted-foreground p-0.5 rounded-sm transition-colors hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); void handleDelete(post.id); }}
                    aria-label="Delete post"
                    title="Delete post (admin)"
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
