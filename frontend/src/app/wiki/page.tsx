'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { wikiArticles } from '@/data/wiki-articles';
import type { WikiArticle } from '@/types';

const CATEGORIES = ['All', 'Transport', 'Apps', 'Food', 'Culture', 'Places', 'Practical'] as const;

function WikiIndex() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState(q);

  useEffect(() => { setSearch(q); }, [q]);

  const filtered = wikiArticles.filter(a => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchSearch =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const grouped = (CATEGORIES.slice(1) as WikiArticle['category'][]).reduce<
    Record<string, WikiArticle[]>
  >((acc, cat) => {
    acc[cat] = filtered.filter(a => a.category === cat);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', margin: '0 auto', padding: '24px var(--spacing-6)' }}>
      <h1 style={{ marginBottom: '8px' }}>Wiki</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: 'var(--font-size-md)' }}>
        Detailed articles on everything Korea — transport, apps, culture, food, and places.
      </p>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search wiki articles..."
          style={{
            width: '100%', maxWidth: '500px',
            padding: '10px 16px',
            border: '1px solid var(--color-border-primary)',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-base)',
            fontFamily: 'var(--font-sans)',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--border-radius-pill)',
              border: '1px solid var(--color-border-primary)',
              background: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
              color: activeCategory === cat ? '#fff' : 'var(--color-text-secondary)',
              fontWeight: activeCategory === cat ? '600' : '400',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-sans)',
              transition: 'all 120ms ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {activeCategory === 'All' ? (
        Object.entries(grouped).map(([cat, articles]) =>
          articles.length === 0 ? null : (
            <section key={cat} style={{ marginBottom: '40px' }}>
              <h2 style={{
                fontSize: 'var(--font-size-lg)', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '8px',
                borderBottom: 'none', paddingBottom: 0,
              }}>
                <span className={`badge badge-${cat.toLowerCase()}`}>{cat}</span>
                <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 'var(--font-size-sm)' }}>
                  {articles.length} article{articles.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <ArticleGrid articles={articles} />
            </section>
          )
        )
      ) : (
        <ArticleGrid articles={filtered} />
      )}

      {filtered.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '48px' }}>
          No articles found for &quot;{search}&quot;.
        </p>
      )}
    </div>
  );
}

function ArticleGrid({ articles }: { articles: WikiArticle[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
      {articles.map(article => (
        <Link key={article.slug} href={`/wiki/${article.slug}`} style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '16px',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-bg-primary)',
            height: '100%',
          }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text-link)', marginTop: 0, border: 'none' }}>
              {article.title}
            </h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {article.summary.slice(0, 100)}…
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function WikiPage() {
  return (
    <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center' }}>Loading…</div>}>
      <WikiIndex />
    </Suspense>
  );
}
