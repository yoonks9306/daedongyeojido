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

function ChevronUp({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  );
}

function ChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
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
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Post vote state
  const [postVote, setPostVote] = useState<1 | -1 | 0>(0);
  const [postVoteLoading, setPostVoteLoading] = useState(false);

  // Comment vote state
  const [commentScores, setCommentScores] = useState<Record<number, number>>({});
  const [commentVotes, setCommentVotes] = useState<Record<number, 1 | -1 | 0>>({});

  function requireLogin() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/community/${post.id}`);
      return true;
    }
    return false;
  }

  async function handlePostVote(direction: 1 | -1) {
    if (requireLogin() || postVoteLoading) return;
    setPostVoteLoading(true);
    try {
      if (postVote === direction) {
        const res = await fetch(`/api/v1/community/posts/${post.id}/vote`, { method: 'DELETE' });
        const data = (await res.json()) as { upvotes?: number };
        if (res.ok && typeof data.upvotes === 'number') {
          setPost((p) => ({ ...p, upvotes: data.upvotes as number }));
          setPostVote(0);
        }
      } else if (direction === 1) {
        const res = await fetch(`/api/v1/community/posts/${post.id}/vote`, { method: 'POST' });
        const data = (await res.json()) as { upvotes?: number };
        if (res.ok && typeof data.upvotes === 'number') {
          setPost((p) => ({ ...p, upvotes: data.upvotes as number }));
          setPostVote(1);
        }
      } else {
        const res = await fetch(`/api/v1/community/posts/${post.id}/vote`, { method: 'DELETE' });
        const data = (await res.json()) as { upvotes?: number };
        if (res.ok && typeof data.upvotes === 'number') {
          setPost((p) => ({ ...p, upvotes: data.upvotes as number }));
          setPostVote(-1);
        }
      }
    } catch { /* ignore */ }
    finally { setPostVoteLoading(false); }
  }

  async function handleCommentVote(commentId: number, direction: 1 | -1) {
    if (requireLogin()) return;
    const current = commentVotes[commentId] ?? 0;
    try {
      if (current === direction) {
        const res = await fetch(`/api/v1/community/comments/${commentId}/vote`, { method: 'DELETE' });
        const data = (await res.json()) as { score?: number };
        if (res.ok && typeof data.score === 'number') {
          setCommentScores((prev) => ({ ...prev, [commentId]: data.score as number }));
          setCommentVotes((prev) => ({ ...prev, [commentId]: 0 }));
        }
      } else {
        const res = await fetch(`/api/v1/community/comments/${commentId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vote: direction }),
        });
        const data = (await res.json()) as { score?: number };
        if (res.ok && typeof data.score === 'number') {
          setCommentScores((prev) => ({ ...prev, [commentId]: data.score as number }));
          setCommentVotes((prev) => ({ ...prev, [commentId]: direction }));
        }
      }
    } catch { /* ignore */ }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requireLogin()) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/v1/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, anonymous }),
      });
      const payload = (await response.json()) as { comment?: CommunityComment; error?: string };
      if (!response.ok || !payload.comment) {
        throw new Error(payload.error ?? 'Failed to post comment.');
      }
      setComments((prev) => [...prev, payload.comment as CommunityComment]);
      setPost((prev) => ({ ...prev, comments: prev.comments + 1 }));
      setContent('');
      setAnonymous(false);
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
            <span className={styles.metaIcon}><CommentIcon /> {post.comments}</span>
            <span className={styles.metaIcon}><ViewIcon /> {post.views.toLocaleString()}</span>
          </div>
        </header>

        <div className={styles.content}>{post.content}</div>

        <div className={styles.postVoteBar}>
          <button
            className={`${styles.voteBtn} ${postVote === 1 ? styles.voteBtnUpActive : ''}`}
            onClick={() => { void handlePostVote(1); }}
            disabled={postVoteLoading}
            aria-label="Upvote post"
          >
            <ChevronUp size={18} />
          </button>
          <span className={styles.voteScore}>{post.upvotes}</span>
          <button
            className={`${styles.voteBtn} ${postVote === -1 ? styles.voteBtnDownActive : ''}`}
            onClick={() => { void handlePostVote(-1); }}
            disabled={postVoteLoading}
            aria-label="Downvote post"
          >
            <ChevronDown size={18} />
          </button>
        </div>
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
            <div className={styles.formFooter}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Post anonymously
              </label>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
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
          {comments.map((comment) => {
            const score = commentScores[comment.id] ?? comment.score;
            const userVote = commentVotes[comment.id] ?? 0;
            return (
              <li key={comment.id} className={styles.commentItem}>
                <div className={styles.commentVoteCol}>
                  <button
                    className={`${styles.commentVoteBtn} ${userVote === 1 ? styles.voteBtnUpActive : ''}`}
                    onClick={() => { void handleCommentVote(comment.id, 1); }}
                    aria-label="Upvote comment"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <span className={styles.commentVoteScore}>{score}</span>
                  <button
                    className={`${styles.commentVoteBtn} ${userVote === -1 ? styles.voteBtnDownActive : ''}`}
                    onClick={() => { void handleCommentVote(comment.id, -1); }}
                    aria-label="Downvote comment"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <div className={styles.commentBody}>
                  <div className={styles.commentMeta}>
                    <strong>{comment.author}</strong>
                    <span>{new Date(comment.createdAt).toLocaleString('en-US')}</span>
                  </div>
                  <p className={styles.commentContent}>{comment.content}</p>
                </div>
              </li>
            );
          })}
          {comments.length === 0 && (
            <li className={styles.empty}>No comments yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
