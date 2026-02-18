import Link from 'next/link';
import SidebarToC from './SidebarToC';
import AdBanner from './AdBanner';
import type { WikiArticle as WikiArticleType } from '@/types';
import { parseWikiContent } from '@/lib/wiki-utils';

const CATEGORY_BADGE_MAP: Record<WikiArticleType['category'], string> = {
  Transport: 'bg-badge-transport',
  Apps: 'bg-badge-apps',
  Food: 'bg-badge-food',
  Culture: 'bg-badge-culture',
  Places: 'bg-badge-places',
  Practical: 'bg-badge-practical',
};

interface WikiArticleProps {
  article: WikiArticleType;
  allArticles: WikiArticleType[];
  viewingRevisionNumber?: number | null;
  latestRevisionNumber?: number | null;
}

export default function WikiArticle({
  article,
  allArticles,
  viewingRevisionNumber = null,
  latestRevisionNumber = null,
}: WikiArticleProps) {
  const related = allArticles.filter(a => article.relatedArticles.includes(a.slug));
  const { processedContent, toc } = parseWikiContent(article.content, article.contentFormat ?? 'html');

  return (
    <div className="grid grid-cols-[minmax(260px,300px)_1fr] gap-8 max-w-[1200px] mx-auto px-6 pt-6 items-start max-lg:grid-cols-1">
      {/* Sidebar: ToC + ad */}
      <aside className="sticky top-[calc(var(--nav-height)+var(--ad-banner-height)+1rem)] max-h-[calc(100vh-var(--nav-height)-var(--ad-banner-height)-2rem)] overflow-y-auto flex flex-col gap-4 w-full max-lg:hidden">
        <SidebarToC
          key={article.slug}
          contentId="article-body"
          initialEntries={toc}
        />
        <AdBanner slot="rectangle" />
      </aside>

      {/* Main article content */}
      <main className="max-w-[860px] min-w-0">
        <header className="mb-6 pb-4 border-b-2 border-primary">
          <div className="mb-2">
            <span className={`inline-block py-0.5 px-2.5 rounded-full text-xs font-semibold uppercase tracking-wide text-white ${CATEGORY_BADGE_MAP[article.category]}`}>
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight text-foreground m-0 mb-3 border-none p-0">{article.title}</h1>
          <div className="mb-3">
            <div className="flex gap-2 flex-wrap">
              <Link href={`/wiki/${article.slug}/edit`} className="inline-block py-1 px-3 bg-card dark:bg-surface border border-border rounded-full text-sm text-primary no-underline transition-colors hover:bg-primary/10 hover:border-primary">
                Edit Article
              </Link>
              <Link href={`/wiki/${article.slug}/history`} className="inline-block py-1 px-3 bg-card dark:bg-surface border border-border rounded-full text-sm text-primary no-underline transition-colors hover:bg-primary/10 hover:border-primary">
                History
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center text-xs text-muted-foreground">
            <span>
              Last updated:{' '}
              {new Date(article.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
            {article.tags.map(tag => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </header>

        {viewingRevisionNumber !== null && latestRevisionNumber !== null && viewingRevisionNumber !== latestRevisionNumber && (
          <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-200">
            You are viewing an older revision (r{viewingRevisionNumber}).{' '}
            <Link href={`/wiki/${article.slug}`} className="underline font-semibold text-red-100">
              Go to latest revision
            </Link>
            .
          </div>
        )}

        <p className="text-lg leading-relaxed text-muted-foreground bg-card dark:bg-surface border-l-4 border-primary p-4 rounded-r-sm mb-6">{article.summary}</p>

        {article.infobox && Object.keys(article.infobox).length > 0 && (
          <div className="float-right clear-right w-[280px] m-0 mb-4 ml-6 bg-card dark:bg-surface border border-border rounded-sm overflow-hidden text-sm max-lg:float-none max-lg:w-full max-lg:ml-0">
            <div className="bg-primary text-primary-foreground py-2 px-3 font-semibold text-sm text-center">{article.title}</div>
            {Object.entries(article.infobox).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[40%_60%] border-t border-border">
                <span className="py-2 px-3 font-medium text-muted-foreground bg-muted text-xs">{key}</span>
                <span className="py-2 px-3 text-foreground">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div
          key={article.slug}
          id="article-body"
          className="wiki-content leading-relaxed clear-both [&_[id]]:scroll-mt-[calc(var(--nav-height)+var(--ad-banner-height)+1rem)] [&_sup]:text-[0.72em] [&_sup]:align-super [&_sup]:leading-none after:content-[''] after:table after:clear-both"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />

        {related.length > 0 && (
          <section className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">See Also</p>
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {related.map(r => (
                <li key={r.slug}>
                  <Link href={`/wiki/${r.slug}`} className="inline-block py-1 px-3 bg-card dark:bg-surface border border-border rounded-full text-sm text-primary no-underline transition-colors hover:bg-primary/10 hover:border-primary">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
