'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import type { CommunityComment, CommunityPost } from '@/types';
import styles from './detail.module.css';

const CAT_LABELS: Record<CommunityPost['category'], string> = {
  review: 'Review',
  question: 'Question',
  free: 'Free Talk',
  tip: 'Tip',
};

function UpvoteIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  );
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

export default function CommunityDetailClient({
  initialPost,
  initialComments,
}: {
  initialPost: CommunityPost;
  initialComments: CommunityComment[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState(initialPost);
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session?.user) {
      router.push(`/login?callbackUrl=/community/${post.id}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const payload = (await response.json()) as { comment?: CommunityComment; error?: string };
      if (!response.ok || !payload.comment) {
        throw new Error(payload.error ?? 'Failed to post comment.');
      }

      setComments((prev) => [...prev, payload.comment as CommunityComment]);
      setPost((prev) => ({ ...prev, comments: prev.comments + 1 }));
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.backRow}>
        <Link href="/community" className={styles.backLink}>← Back to Community</Link>
      </div>

      <article className={styles.postCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={`${styles.catBadge} ${styles[`cat${post.category.charAt(0).toUpperCase() + post.category.slice(1)}` as keyof typeof styles]}`}>
              {CAT_LABELS[post.category]}
            </span>
            <span>{post.author}</span>
            <span>{new Date(post.createdAt).toLocaleString('en-US')}</span>
            <span className={styles.metaIcon}><UpvoteIcon /> {post.upvotes}</span>
            <span className={styles.metaIcon}><CommentIcon /> {post.comments}</span>
            <span className={styles.metaIcon}><ViewIcon /> {post.views.toLocaleString()}</span>
          </div>
        </header>

        <div className={styles.content}>{post.content}</div>
      </article>

      <section className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Comments ({comments.length})</h2>

        {session?.user ? (
          <form className={styles.commentForm} onSubmit={handleSubmit}>
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={2000}
              placeholder="Write a comment..."
              required
              disabled={submitting}
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            <span>Login required to write a comment.</span>
            <Link href={`/login?callbackUrl=/community/${post.id}`} className={styles.loginLink}>
              Sign in
            </Link>
          </div>
        )}

        <ul className={styles.commentList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentMeta}>
                <strong>{comment.author}</strong>
                <span>{new Date(comment.createdAt).toLocaleString('en-US')}</span>
              </div>
              <p className={styles.commentContent}>{comment.content}</p>
            </li>
          ))}
          {comments.length === 0 && (
            <li className={styles.empty}>No comments yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
