'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { autocompletion, type CompletionContext, type CompletionResult } from '@codemirror/autocomplete';
import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import type { Extension } from '@codemirror/state';
import { tags } from '@lezer/highlight';
import { parseWikiContent, WIKI_CATEGORIES } from '@/lib/wiki-utils';

type EditorInitial = {
  title: string;
  category: (typeof WIKI_CATEGORIES)[number];
  summary: string;
  content: string;
  contentFormat: 'markdown' | 'html';
  tagsText: string;
  relatedArticlesText: string;
  baseRevisionNumber: number;
};

interface WikiEditorFormProps {
  mode: 'create' | 'edit';
  slug?: string;
  initial: EditorInitial;
}

type SearchResult = {
  slug: string;
  title: string;
  category: string;
};

const cmTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--cm-editor-bg)',
      color: 'var(--foreground)',
      fontSize: '13px',
      border: '1px solid var(--border)',
      borderRadius: '0.25rem',
    },
    '.cm-content': {
      fontFamily: 'var(--font-mono)',
      lineHeight: '1.5',
      minHeight: '420px',
      padding: '10px 0',
    },
    '.cm-line': {
      padding: '0 10px',
      color: 'var(--cm-editor-text)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--cm-gutter-bg)',
      color: 'var(--cm-gutter-text)',
      borderRight: '1px solid var(--border)',
    },
    '.cm-activeLine': {
      backgroundColor: 'var(--cm-active-line)',
    },
    '.cm-activeLineGutter': {
      color: 'var(--cm-active-gutter)',
      fontWeight: '700',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--foreground)',
    },
    '&.cm-focused': {
      outline: '1px solid var(--ring)',
    },
    '.cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'color-mix(in srgb, var(--primary) 24%, transparent) !important',
    },
    '.cm-tooltip-autocomplete': {
      border: '1px solid var(--border)',
      backgroundColor: 'var(--card)',
      color: 'var(--foreground)',
    },
    '.cm-tooltip-autocomplete ul': {
      maxHeight: '220px',
      overflowY: 'auto',
    },
    '.cm-completionLabel': {
      fontFamily: 'var(--font-sans)',
    },
    '.cm-tooltip-autocomplete ul li[aria-selected]': {
      backgroundColor: 'color-mix(in srgb, var(--primary) 14%, transparent)',
    },
  },
  { dark: true }
);

const cmSyntax = HighlightStyle.define([
  { tag: tags.heading, color: 'var(--cm-syntax-heading)', fontWeight: '700' },
  { tag: tags.strong, color: 'var(--cm-syntax-strong)', fontWeight: '700' },
  { tag: tags.emphasis, color: 'var(--cm-syntax-emphasis)', fontStyle: 'italic' },
  { tag: tags.strikethrough, color: 'var(--cm-syntax-strike)', textDecoration: 'line-through' },
  { tag: tags.link, color: 'var(--cm-syntax-link)', textDecoration: 'underline' },
  { tag: tags.url, color: 'var(--cm-syntax-link)' },
  { tag: tags.monospace, color: 'var(--cm-syntax-code)' },
  { tag: tags.quote, color: 'var(--cm-syntax-quote)' },
  { tag: tags.list, color: 'var(--cm-syntax-list)' },
  { tag: tags.atom, color: 'var(--cm-syntax-atom)' },
]);

export default function WikiEditorForm({ mode, slug, initial }: WikiEditorFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [summary, setSummary] = useState(initial.summary);
  const [content, setContent] = useState(initial.content);
  const [contentFormat] = useState<'markdown' | 'html'>('markdown');
  const [tagsText, setTagsText] = useState(initial.tagsText);
  const [relatedArticlesText, setRelatedArticlesText] = useState(initial.relatedArticlesText);
  const [baseRevisionNumber, setBaseRevisionNumber] = useState(initial.baseRevisionNumber);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'split'>('split');

  const previewHtml = useMemo(() => {
    return parseWikiContent(content, contentFormat).processedContent;
  }, [content, contentFormat]);

  const inputClass = 'border border-border rounded-sm bg-background text-foreground font-sans py-2.5 px-3';
  const toolbarBtnClass = 'inline-flex h-8 items-center rounded-md border border-border px-2 text-xs hover:bg-muted/40';

  const wikiLinkCompletions = useMemo<Extension>(() => {
    const completionSource = async (context: CompletionContext): Promise<CompletionResult | null> => {
      const before = context.matchBefore(/\[\[[^\]\|\n]*/);
      if (!before) return null;
      if (!context.explicit && before.from === before.to) return null;

      const query = before.text.slice(2).trim();
      if (!query && !context.explicit) return null;

      try {
        const response = await fetch(`/api/v1/wiki/autocomplete?q=${encodeURIComponent(query)}&limit=8`);
        if (!response.ok) return null;

        const payload = (await response.json()) as {
          results?: Array<{
            slug: string;
            title: string;
            category: string;
          }>;
        };

        const rows: SearchResult[] = (payload.results ?? []).slice(0, 8);
        if (!rows.length) return null;

        return {
          from: before.from,
          to: context.pos,
          options: rows.map((item) => ({
            label: item.title,
            detail: `/${item.slug} · ${item.category}`,
            apply: `[[${item.slug}]]`,
            type: 'keyword',
          })),
          validFor: /\[\[[^\]\|\n]*/,
        };
      } catch {
        return null;
      }
    };

    return autocompletion({
      override: [completionSource],
      activateOnTyping: true,
      maxRenderedOptions: 8,
    });
  }, []);

  const editorExtensions = useMemo<Extension[]>(() => {
    return [
      markdown(),
      wikiLinkCompletions,
      syntaxHighlighting(cmSyntax, { fallback: true }),
      cmTheme,
      EditorView.lineWrapping,
      EditorView.theme({
        '.cm-scroller': { fontFamily: 'var(--font-mono)' },
      }),
    ];
  }, [wikiLinkCompletions]);

  function updateEditorContent(next: string) {
    setContent(next);
  }

  function replaceSelection(replacement: string) {
    const view = editorViewRef.current;
    if (!view) {
      setContent((prev) => prev + replacement);
      return;
    }

    const { from, to } = view.state.selection.main;
    view.dispatch({
      changes: { from, to, insert: replacement },
      selection: { anchor: from + replacement.length },
    });
    view.focus();
  }

  function wrapSelection(prefix: string, suffix: string, fallback: string) {
    const view = editorViewRef.current;
    if (!view) {
      setContent((prev) => prev + `${prefix}${fallback}${suffix}`);
      return;
    }

    const { from, to } = view.state.selection.main;
    const selected = view.state.doc.sliceString(from, to) || fallback;
    const replacement = `${prefix}${selected}${suffix}`;

    view.dispatch({
      changes: { from, to, insert: replacement },
      selection: { anchor: from + replacement.length },
    });
    view.focus();
  }

  async function handleImagePicked(file: File | null) {
    if (!file) return;
    setUploadingImage(true);
    setUploadMessage(null);
    setError(null);

    try {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch('/api/v1/uploads', {
        method: 'POST',
        body: form,
      });
      const payload = (await response.json()) as {
        error?: string;
        publicUrl?: string;
      };
      if (!response.ok || !payload.publicUrl) {
        throw new Error(payload.error ?? 'Image upload failed.');
      }

      const alt = file.name.replace(/\.[^/.]+$/, '') || 'image';
      replaceSelection(`\n![${alt}](${payload.publicUrl})\n`);
      setUploadMessage('Image uploaded and inserted.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Image upload failed.');
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  }

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
          contentFormat,
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

  return (
    <div className="max-w-[1200px] mx-auto p-6">
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

        <label className="text-sm text-muted-foreground" htmlFor="content">Content Editor</label>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              <button type="button" className={`h-8 px-3 text-xs ${viewMode === 'editor' ? 'bg-primary text-primary-foreground' : 'bg-background'}`} onClick={() => setViewMode('editor')}>Editor</button>
              <button type="button" className={`h-8 px-3 text-xs ${viewMode === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-background'}`} onClick={() => setViewMode('preview')}>Preview</button>
              <button type="button" className={`h-8 px-3 text-xs ${viewMode === 'split' ? 'bg-primary text-primary-foreground' : 'bg-background'}`} onClick={() => setViewMode('split')}>Split View</button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('\n## Heading\n')}>H2</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('\n### Subheading\n')}>H3</button>
              <button type="button" className={toolbarBtnClass} onClick={() => wrapSelection('**', '**', 'bold text')}>Bold</button>
              <button type="button" className={toolbarBtnClass} onClick={() => wrapSelection('*', '*', 'italic text')}>Italic</button>
              <button type="button" className={toolbarBtnClass} onClick={() => wrapSelection('~~', '~~', 'strike text')}>Strike</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('> quote')}>Quote</button>
              <button type="button" className={toolbarBtnClass} onClick={() => wrapSelection('`', '`', 'code')}>Inline Code</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('```\ncode\n```\n')}>Code Block</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('| Column A | Column B |\n| --- | --- |\n| Value 1 | Value 2 |\n')}>Table</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('[label](https://)\n')}>Link</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('[[kakaot]]')}>Wiki Link</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('[YouTube|medium|center](https://www.youtube.com/watch?v=VIDEO_ID)\n')}>YouTube</button>
              <button type="button" className={toolbarBtnClass} onClick={() => replaceSelection('[Google Map|medium|center](https://maps.google.com/?q=Seoul+Station)\n')}>Map</button>
              <button
                type="button"
                className={toolbarBtnClass}
                disabled={uploadingImage}
                onClick={() => imageInputRef.current?.click()}
              >
                {uploadingImage ? 'Uploading...' : 'Image'}
              </button>
            </div>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleImagePicked(e.target.files?.[0] ?? null)}
          />

          {uploadMessage && <p className="text-xs text-primary">{uploadMessage}</p>}

          <div className="rounded-md border border-border bg-background/60 px-3 py-2 text-xs">
            <p>
              For detailed syntax and writing examples, please review <a className="text-primary underline" href="/wiki/editor-manual">Editor Manual</a> before editing.
            </p>
          </div>

          {(viewMode === 'editor' || viewMode === 'split') && (
            <div className={viewMode === 'split' ? 'grid gap-3 lg:grid-cols-2' : 'grid gap-3'}>
              <div className="h-[460px]">
                <CodeMirror
                  className="cm-surface"
                  value={content}
                  height="460px"
                  extensions={editorExtensions}
                  onCreateEditor={(view) => {
                    editorViewRef.current = view;
                  }}
                  onChange={(value) => updateEditorContent(value)}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLine: true,
                  highlightActiveLineGutter: true,
                  foldGutter: false,
                  syntaxHighlighting: false,
                }}
              />
              </div>

              {viewMode === 'split' && (
                <div className="h-[460px] flex flex-col">
                  <div className="editor-preview wiki-content rounded-sm border border-border bg-background p-4 leading-relaxed flex-1 overflow-auto" dangerouslySetInnerHTML={{ __html: previewHtml || '<p>(No content yet)</p>' }} />
                </div>
              )}
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="grid gap-3">
              <div className="editor-preview wiki-content rounded-sm border border-border bg-background p-4 min-h-[460px] leading-relaxed" dangerouslySetInnerHTML={{ __html: previewHtml || '<p>(No content yet)</p>' }} />
            </div>
          )}
        </div>

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
