'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import type { CommunityPost } from '@/types';
import styles from './community.module.css';

type Tab = 'all' | 'daily' | 'weekly' | 'monthly';

const TABS: { key: Tab; label: string }[] = [
  { key: 'all',     label: 'All Posts' },
  { key: 'daily',   label: '🔥 Daily Best' },
  { key: 'weekly',  label: '⭐ Weekly Best' },
  { key: 'monthly', label: '🏆 Monthly Best' },
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

export default function CommunityClient({ posts }: { posts: CommunityPost[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [upvotesByPost, setUpvotesByPost] = useState<Record<number, number>>({});
  const [votedPosts, setVotedPosts] = useState<Record<number, boolean>>({});
  const [loadingVote, setLoadingVote] = useState<Record<number, boolean>>({});
  const [voteError, setVoteError] = useState<string | null>(null);

  const resolvedPosts = useMemo(
    () => posts.map((post) => ({ ...post, upvotes: upvotesByPost[post.id] ?? post.upvotes })),
    [posts, upvotesByPost]
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
          <li key={post.id} className={styles.postItem}>
            <div className={styles.voteCol}>
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
              <Link href={`/community/${post.id}`} className={styles.postTitle}>
                {post.title}
              </Link>
              <div className={styles.postMeta}>
                <span className={`${styles.catBadge} ${styles[`cat${post.category.charAt(0).toUpperCase() + post.category.slice(1)}` as keyof typeof styles]}`}>
                  {CAT_LABELS[post.category]}
                </span>
                <span>{post.author}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>

            <div className={styles.statsCol}>
              <span className={styles.statItem}>👁 {post.views.toLocaleString()}</span>
              <span className={styles.statItem}>💬 {post.comments}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
