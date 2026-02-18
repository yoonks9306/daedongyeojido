'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WIKI_CATEGORIES } from '@/lib/wiki-utils';

type EditorInitial = {
  title: string;
  category: (typeof WIKI_CATEGORIES)[number];
  summary: string;
  content: string;
  tagsText: string;
  relatedArticlesText: string;
  baseRevisionNumber: number;
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
  const [baseRevisionNumber, setBaseRevisionNumber] = useState(initial.baseRevisionNumber);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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
          ...(mode === 'edit' ? { baseRevisionNumber } : {}),
        }),
      });

      const payload = (await response.json()) as {
        slug?: string;
        error?: string;
        revisionNumber?: number;
        currentRevisionNumber?: number;
      };
      if (!response.ok || !payload.slug) {
        if (response.status === 409) {
          const latest = typeof payload.currentRevisionNumber === 'number'
            ? payload.currentRevisionNumber
            : null;
          throw new Error(
            latest === null
              ? 'Another user updated this article. Reload and merge your changes.'
              : `Another user updated this article (latest revision: #${latest}). Reload and merge your changes.`
          );
        }
        throw new Error(payload.error ?? 'Failed to save wiki article.');
      }

      if (typeof payload.revisionNumber === 'number') {
        setBaseRevisionNumber(payload.revisionNumber);
      }

      router.push(`/wiki/${payload.slug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save wiki article.');
      setSaving(false);
    }
  }

  const inputClass = 'border border-border rounded-sm bg-background text-foreground font-sans py-2.5 px-3';

  return (
    <div className="max-w-[960px] mx-auto p-6">
      <h1 className="text-3xl mb-5">{mode === 'create' ? 'Write Wiki Article' : 'Edit Wiki Article'}</h1>
      <form className="grid gap-3 border border-border rounded-sm bg-card dark:bg-surface p-5" onSubmit={handleSubmit}>
        <label className="text-sm text-muted-foreground" htmlFor="title">Title</label>
        <input
          id="title"
          className={inputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          required
          disabled={saving}
        />

        <label className="text-sm text-muted-foreground" htmlFor="category">Category</label>
        <select
          id="category"
          className={inputClass}
          value={category}
          onChange={(event) => setCategory(event.target.value as (typeof WIKI_CATEGORIES)[number])}
          disabled={saving}
        >
          {WIKI_CATEGORIES.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <label className="text-sm text-muted-foreground" htmlFor="summary">Summary</label>
        <textarea
          id="summary"
          className={`${inputClass} min-h-24 resize-y`}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          maxLength={300}
          required
          disabled={saving}
        />

        <label className="text-sm text-muted-foreground" htmlFor="content">Content (HTML allowed)</label>
        <textarea
          id="content"
          className={`${inputClass} min-h-[360px] resize-y`}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={40000}
          required
          disabled={saving}
        />

        <label className="text-sm text-muted-foreground" htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          className={inputClass}
          value={tagsText}
          onChange={(event) => setTagsText(event.target.value)}
          disabled={saving}
        />

        <label className="text-sm text-muted-foreground" htmlFor="related">Related article slugs (comma-separated)</label>
        <input
          id="related"
          className={inputClass}
          value={relatedArticlesText}
          onChange={(event) => setRelatedArticlesText(event.target.value)}
          disabled={saving}
        />

        {error && <p className="text-destructive text-sm">{error}</p>}

        <div className="flex justify-end gap-2 mt-2">
          <button type="button" className="border border-border rounded-sm py-2.5 px-3.5 font-sans cursor-pointer bg-background text-muted-foreground" onClick={() => router.back()} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="border border-primary rounded-sm py-2.5 px-3.5 font-sans cursor-pointer bg-primary text-primary-foreground" disabled={saving}>
            {saving ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
