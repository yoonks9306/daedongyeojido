'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './new.module.css';

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Write a Community Post</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="category">Category</label>
        <select
          id="category"
          className={styles.select}
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

        <label className={styles.label} htmlFor="title">Title</label>
        <input
          id="title"
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          required
          disabled={submitting}
        />

        <label className={styles.label} htmlFor="content">Content</label>
        <textarea
          id="content"
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={4000}
          required
          disabled={submitting}
        />

        <label className={styles.label} htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          className={styles.input}
          type="text"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
          placeholder="seoul, sim, airport"
          disabled={submitting}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => router.push('/community')} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
