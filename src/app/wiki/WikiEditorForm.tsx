'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WIKI_CATEGORIES } from '@/lib/wiki-utils';
import styles from './wiki-editor.module.css';

type EditorInitial = {
  title: string;
  category: (typeof WIKI_CATEGORIES)[number];
  summary: string;
  content: string;
  tagsText: string;
  relatedArticlesText: string;
};

interface WikiEditorFormProps {
  mode: 'create' | 'edit';
  slug?: string;
  initial: EditorInitial;
}

export default function WikiEditorForm({ mode, slug, initial }: WikiEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [summary, setSummary] = useState(initial.summary);
  const [content, setContent] = useState(initial.content);
  const [tagsText, setTagsText] = useState(initial.tagsText);
  const [relatedArticlesText, setRelatedArticlesText] = useState(initial.relatedArticlesText);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const tags = tagsText.split(',').map((item) => item.trim()).filter(Boolean);
    const relatedArticles = relatedArticlesText.split(',').map((item) => item.trim()).filter(Boolean);

    try {
      const endpoint = mode === 'create' ? '/api/v1/wiki/articles' : `/api/v1/wiki/articles/${slug}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          summary,
          content,
          tags,
          relatedArticles,
        }),
      });

      const payload = (await response.json()) as { slug?: string; error?: string };
      if (!response.ok || !payload.slug) {
        throw new Error(payload.error ?? 'Failed to save wiki article.');
      }

      router.push(`/wiki/${payload.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save wiki article.');
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{mode === 'create' ? 'Write Wiki Article' : 'Edit Wiki Article'}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          id="title"
          className={styles.input}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          required
          disabled={saving}
        />

        <label className={styles.label} htmlFor="category">Category</label>
        <select
          id="category"
          className={styles.input}
          value={category}
          onChange={(event) => setCategory(event.target.value as (typeof WIKI_CATEGORIES)[number])}
          disabled={saving}
        >
          {WIKI_CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          className={styles.textareaSmall}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          maxLength={300}
          required
          disabled={saving}
        />

        <label className={styles.label} htmlFor="content">Content (HTML allowed)</label>
        <textarea
          id="content"
          className={styles.textareaLarge}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={40000}
          required
          disabled={saving}
        />

        <label className={styles.label} htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          className={styles.input}
          value={tagsText}
          onChange={(event) => setTagsText(event.target.value)}
          disabled={saving}
        />

        <label className={styles.label} htmlFor="related">Related article slugs (comma-separated)</label>
        <input
          id="related"
          className={styles.input}
          value={relatedArticlesText}
          onChange={(event) => setRelatedArticlesText(event.target.value)}
          disabled={saving}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={() => router.back()} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn} disabled={saving}>
            {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
