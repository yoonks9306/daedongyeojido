'use client';

import { useState } from 'react';
import { communityPosts } from '@/data/community-posts';
import AdBanner from '@/components/AdBanner';
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

function getPostsForTab(tab: Tab) {
  const sorted = [...communityPosts].sort((a, b) => b.upvotes - a.upvotes);
  if (tab === 'all')     return communityPosts;
  if (tab === 'daily')   return sorted.slice(0, 5);
  if (tab === 'weekly')  return sorted.slice(0, 10);
  return sorted;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const posts = getPostsForTab(activeTab);

  return (
    <div className={styles.communityPage}>
      <h1 className={styles.pageTitle}>
        Community
        <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 400, color: 'var(--color-text-muted)' }}>
          — Reviews, Questions &amp; Free Talk
        </span>
      </h1>

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
        {posts.map(post => (
          <li key={post.id} className={styles.postItem}>
            <div className={styles.voteCol}>
              <button className={styles.voteBtn} aria-label="Upvote">▲</button>
              <span className={styles.voteCount}>{post.upvotes}</span>
            </div>

            <div className={styles.postContent}>
              <div className={styles.postTitle}>{post.title}</div>
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
