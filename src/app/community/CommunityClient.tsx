'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import type { CommunityPost } from '@/types';
import styles from './community.module.css';

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

/* SVG icons */
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
    <div className={styles.communityPage}>
      <div className={styles.titleRow}>
        <h1 className={styles.pageTitle}>
          Community
          <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 400, color: 'var(--color-text-muted)' }}>
            — Reviews, Questions &amp; Free Talk
          </span>
        </h1>
        <Link href="/community/new" className={styles.writeBtn}>Write Post</Link>
      </div>

      {voteError && <p className={styles.voteError}>{voteError}</p>}

      <div className={styles.bestTabs} role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`${styles.bestTab} ${activeTab === tab.key ? styles.bestTabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ul className={styles.postList} role="list">
        {displayPosts.map(post => (
          <li
            key={post.id}
            className={styles.postItem}
            onClick={() => router.push(`/community/${post.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.voteCol} onClick={(e) => e.stopPropagation()}>
              <button
                className={`${styles.voteBtn} ${votedPosts[post.id] ? styles.voteBtnActive : ''}`}
                aria-label={votedPosts[post.id] ? 'Remove upvote' : 'Upvote'}
                onClick={() => { void handleVote(post.id); }}
                disabled={Boolean(loadingVote[post.id])}
              >
                ▲
              </button>
              <span className={styles.voteCount}>{post.upvotes}</span>
            </div>

            <div className={styles.postContent}>
              <span className={styles.postTitle}>
                {post.title}
              </span>
              <div className={styles.postMeta}>
                <span className={`${styles.catBadge} ${styles[`cat${post.category.charAt(0).toUpperCase() + post.category.slice(1)}` as keyof typeof styles]}`}>
                  {CAT_LABELS[post.category]}
                </span>
                <span>{post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className={styles.metaIcon}><CommentIcon /> {post.comments}</span>
                <span className={styles.metaIcon}><ViewIcon /> {post.views.toLocaleString()}</span>
                {isAdmin && (
                  <button
                    className={styles.deleteBtn}
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
