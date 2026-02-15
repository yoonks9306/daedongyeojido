import Link from 'next/link';
import SidebarToC from './SidebarToC';
import AdBanner from './AdBanner';
import styles from './WikiArticle.module.css';
import type { WikiArticle as WikiArticleType } from '@/types';

const CATEGORY_BADGE_MAP: Record<WikiArticleType['category'], string> = {
  Transport: 'badge badge-transport',
  Apps:      'badge badge-apps',
  Food:      'badge badge-food',
  Culture:   'badge badge-culture',
  Places:    'badge badge-places',
  Practical: 'badge badge-practical',
};

interface WikiArticleProps {
  article: WikiArticleType;
  allArticles: WikiArticleType[];
}

export default function WikiArticle({ article, allArticles }: WikiArticleProps) {
  const related = allArticles.filter(a => article.relatedArticles.includes(a.slug));

  return (
    <div className={styles.articlePage}>
      {/* Sidebar: ToC + ad */}
      <aside className={styles.sidebar}>
        <SidebarToC contentId="article-body" />
        <AdBanner slot="rectangle" />
      </aside>

      {/* Main article content */}
      <main className={styles.main}>
        <header className={styles.articleHeader}>
          <div className={styles.articleCategory}>
            <span className={CATEGORY_BADGE_MAP[article.category]}>
              {article.category}
            </span>
          </div>
          <h1 className={styles.articleTitle}>{article.title}</h1>
          <div style={{ marginBottom: 'var(--spacing-3)' }}>
            <Link href={`/wiki/${article.slug}/edit`} className={styles.relatedLink}>
              Edit Article
            </Link>
          </div>
          <div className={styles.articleMeta}>
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

        <p className={styles.articleSummary}>{article.summary}</p>

        {article.infobox && Object.keys(article.infobox).length > 0 && (
          <div className={styles.infobox}>
            <div className={styles.infoboxTitle}>{article.title}</div>
            {Object.entries(article.infobox).map(([key, value]) => (
              <div key={key} className={styles.infoboxRow}>
                <span className={styles.infoboxKey}>{key}</span>
                <span className={styles.infoboxValue}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <div
          id="article-body"
          className={styles.articleBody}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {related.length > 0 && (
          <section className={styles.relatedArticles}>
            <p className={styles.relatedTitle}>See Also</p>
            <ul className={styles.relatedList}>
              {related.map(r => (
                <li key={r.slug}>
                  <Link href={`/wiki/${r.slug}`} className={styles.relatedLink}>
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
