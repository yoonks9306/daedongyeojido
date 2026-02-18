'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Category = 'review' | 'question' | 'free' | 'tip';

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'review', label: 'Review' },
  { value: 'question', label: 'Question' },
  { value: 'free', label: 'Free Talk' },
  { value: 'tip', label: 'Tip' },
];

export default function NewCommunityPostForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('free');
  const [tagsText, setTagsText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const tags = tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await fetch('/api/v1/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          category,
          tags,
          anonymous,
        }),
      });

      const payload = (await response.json()) as { id?: number; error?: string };
      if (!response.ok || !payload.id) {
        throw new Error(payload.error ?? 'Failed to create post');
      }

      router.push('/community');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      setSubmitting(false);
    }
  }

  const inputClass = 'w-full border border-border rounded-sm bg-background text-foreground font-sans py-2.5 px-3';

  return (
    <div className="max-w-[880px] mx-auto p-6">
      <h1 className="text-3xl mb-5">Write a Community Post</h1>

      <form className="grid gap-3 border border-border bg-card dark:bg-surface rounded-sm p-5" onSubmit={handleSubmit}>
        <label className="text-sm text-muted-foreground" htmlFor="category">Category</label>
        <select
          id="category"
          className={inputClass}
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          disabled={submitting}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="text-sm text-muted-foreground" htmlFor="title">Title</label>
        <input
          id="title"
          className={inputClass}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
          disabled={submitting}
        />

        <label className="text-sm text-muted-foreground" htmlFor="content">Content</label>
        <textarea
          id="content"
          className={`${inputClass} min-h-[220px] resize-y`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={4000}
          required
          disabled={submitting}
        />

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            disabled={submitting}
          />
          Post anonymously
        </label>

        <label className="text-sm text-muted-foreground" htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          className={inputClass}
          type="text"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="seoul, sim, airport"
          disabled={submitting}
        />

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex justify-end gap-2 mt-2">
          <button type="button" className="border border-border rounded-sm py-2.5 px-3.5 font-sans cursor-pointer bg-background text-muted-foreground" onClick={() => router.push('/community')} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="border border-primary rounded-sm py-2.5 px-3.5 font-sans cursor-pointer bg-primary text-primary-foreground" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
