'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { WikiArticle } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Transport', 'Apps', 'Food', 'Culture', 'Places', 'Practical'] as const;

const CATEGORY_BADGE: Record<string, string> = {
  Transport: 'bg-badge-transport',
  Apps: 'bg-badge-apps',
  Food: 'bg-badge-food',
  Culture: 'bg-badge-culture',
  Places: 'bg-badge-places',
  Practical: 'bg-badge-practical',
};

function WikiIndex({ articles }: { articles: WikiArticle[] }) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState(q);

  useEffect(() => { setSearch(q); }, [q]);

  const filtered = articles.filter(a => {
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
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex justify-between items-center gap-3 mb-2 flex-wrap">
        <h1 className="mb-0">Wiki</h1>
        <Link
          href="/wiki/new"
          className="inline-flex items-center justify-center py-2 px-3 rounded-sm bg-primary text-primary-foreground no-underline text-sm font-medium"
        >
          Write Article
        </Link>
      </div>
      <p className="text-muted-foreground mb-6 text-lg">
        Detailed articles on everything Korea — transport, apps, culture, food, and places.
      </p>

      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search wiki articles..."
          className="w-full max-w-[500px] py-2.5 px-4 border border-border rounded-sm bg-card dark:bg-surface text-foreground text-base font-sans"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'py-1.5 px-4 rounded-full border border-border cursor-pointer text-sm font-sans transition-all',
              activeCategory === cat
                ? 'bg-primary text-primary-foreground font-semibold border-primary'
                : 'bg-card dark:bg-surface text-muted-foreground'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {activeCategory === 'All' ? (
        Object.entries(grouped).map(([cat, catArticles]) =>
          catArticles.length === 0 ? null : (
            <section key={cat} className="mb-10">
              <h2 className="text-lg mb-4 flex items-center gap-2 border-none pb-0">
                <span className={cn('inline-block py-0.5 px-2.5 rounded-full text-xs font-semibold uppercase tracking-wide text-white', CATEGORY_BADGE[cat])}>
                  {cat}
                </span>
                <span className="text-muted-foreground font-normal text-sm">
                  {catArticles.length} article{catArticles.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <ArticleGrid articles={catArticles} />
            </section>
          )
        )
      ) : (
        <ArticleGrid articles={filtered} />
      )}

      {filtered.length === 0 && (
        <p className="text-muted-foreground text-center py-12">
          No articles found for &quot;{search}&quot;.
        </p>
      )}
    </div>
  );
}

function ArticleGrid({ articles }: { articles: WikiArticle[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
      {articles.map(article => (
        <Link key={article.slug} href={`/wiki/${article.slug}`} className="no-underline">
          <div className="p-4 border border-border/50 rounded-sm bg-background h-full hover:border-border transition-colors">
            <h3 className="text-base font-semibold mb-1.5 text-primary mt-0 border-none">
              {article.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-normal m-0">
              {article.summary.slice(0, 100)}…
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function WikiIndexClient({ articles }: { articles: WikiArticle[] }) {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading…</div>}>
      <WikiIndex articles={articles} />
    </Suspense>
  );
}
