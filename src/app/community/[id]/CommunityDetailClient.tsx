'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import type { CommunityComment, CommunityPost } from '@/types';
import { cn } from '@/lib/utils';

const CAT_LABELS: Record<CommunityPost['category'], string> = {
  review: 'Review',
  question: 'Question',
  free: 'Free Talk',
  tip: 'Tip',
};

const CAT_STYLES: Record<string, string> = {
  review: 'bg-[#e8f5e9] text-[#2e7d32] dark:bg-[#1b3a1e] dark:text-[#66bb6a]',
  question: 'bg-[#e3f2fd] text-[#1565c0] dark:bg-[#1a2a3a] dark:text-[#64b5f6]',
  free: 'bg-[#fce4ec] text-[#880e4f] dark:bg-[#3a1a2a] dark:text-[#f48fb1]',
  tip: 'bg-[#fff8e1] text-[#f57f17] dark:bg-[#3a3010] dark:text-[#ffd54f]',
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
    <div className="max-w-[980px] mx-auto p-6">
      <div>
        <Link href="/community" className="text-primary no-underline text-sm">← Back to Community</Link>
      </div>

      <article className="border border-border bg-card dark:bg-surface rounded-sm p-5 mb-6">
        <header className="border-b border-border pb-3 mb-4">
          <h1 className="m-0 mb-2 text-3xl">{post.title}</h1>
          <div className="flex flex-wrap gap-3 text-muted-foreground text-xs">
            <span className={cn('inline-flex items-center rounded-sm px-2 py-0.5 font-medium text-xs', CAT_STYLES[post.category])}>
              {CAT_LABELS[post.category]}
            </span>
            <span>{post.author}</span>
            <span>{new Date(post.createdAt).toLocaleString('en-US')}</span>
            <span className="inline-flex items-center gap-1"><CommentIcon /> {post.comments}</span>
            <span className="inline-flex items-center gap-1"><ViewIcon /> {post.views.toLocaleString()}</span>
          </div>
        </header>

        <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
          <button
            className={cn(
              'inline-flex items-center justify-center bg-transparent border border-border rounded-sm cursor-pointer text-muted-foreground py-1 px-2 transition-colors hover:text-foreground hover:border-muted-foreground',
              postVote === 1 && 'text-primary border-primary'
            )}
            onClick={() => { void handlePostVote(1); }}
            disabled={postVoteLoading}
            aria-label="Upvote post"
          >
            <ChevronUp size={18} />
          </button>
          <span>{post.upvotes}</span>
          <button
            className={cn(
              'inline-flex items-center justify-center bg-transparent border border-border rounded-sm cursor-pointer text-muted-foreground py-1 px-2 transition-colors hover:text-foreground hover:border-muted-foreground',
              postVote === -1 && 'text-[#64b5f6] border-[#64b5f6]'
            )}
            onClick={() => { void handlePostVote(-1); }}
            disabled={postVoteLoading}
            aria-label="Downvote post"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </article>

      <section className="border border-border bg-card dark:bg-surface rounded-sm p-5">
        <h2 className="mt-0 mb-4 text-base font-semibold text-foreground">Comments ({comments.length})</h2>

        {session?.user ? (
          <form className="mb-4" onSubmit={handleSubmit}>
            <textarea
              className="w-full min-h-[100px] border border-border rounded-sm bg-background text-foreground font-sans py-2.5 px-3 resize-y"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={2000}
              placeholder="Write a comment..."
              required
              disabled={submitting}
            />
            <div className="flex items-center justify-between mt-2">
              <label className="inline-flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Post anonymously
              </label>
              <button type="submit" className="border border-primary bg-primary text-primary-foreground rounded-sm py-2.5 px-3.5 font-sans cursor-pointer" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </form>
        ) : (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <span>Login required to write a comment.</span>
            <Link href={`/login?callbackUrl=/community/${post.id}`} className="text-primary no-underline">
              Sign in
            </Link>
          </div>
        )}

        <ul className="list-none m-0 p-0">
          {comments.map((comment) => {
            const score = commentScores[comment.id] ?? comment.score;
            const userVote = commentVotes[comment.id] ?? 0;
            return (
              <li key={comment.id} className="flex gap-3 border-t border-border/50 py-3">
                <div className="flex flex-col items-center gap-1 min-w-[2rem]">
                  <button
                    className={cn(
                      'inline-flex items-center justify-center bg-transparent border border-border rounded-sm cursor-pointer text-muted-foreground py-1 px-2 transition-colors hover:text-foreground hover:border-muted-foreground',
                      userVote === 1 && 'text-primary border-primary'
                    )}
                    onClick={() => { void handleCommentVote(comment.id, 1); }}
                    aria-label="Upvote comment"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <span className="text-xs text-muted-foreground">{score}</span>
                  <button
                    className={cn(
                      'inline-flex items-center justify-center bg-transparent border border-border rounded-sm cursor-pointer text-muted-foreground py-1 px-2 transition-colors hover:text-foreground hover:border-muted-foreground',
                      userVote === -1 && 'text-[#64b5f6] border-[#64b5f6]'
                    )}
                    onClick={() => { void handleCommentVote(comment.id, -1); }}
                    aria-label="Downvote comment"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                    <strong className="text-foreground">{comment.author}</strong>
                    <span>{new Date(comment.createdAt).toLocaleString('en-US')}</span>
                  </div>
                  <p className="m-0 text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                </div>
              </li>
            );
          })}
          {comments.length === 0 && (
            <li className="py-6 text-center text-muted-foreground text-sm">No comments yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
