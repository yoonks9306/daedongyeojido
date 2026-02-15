import type { Metadata } from 'next';
import AdBanner from '@/components/AdBanner';
import { guideSections } from '@/data/guide-content';
import styles from './guide/guide.module.css';

export const metadata: Metadata = {
  title: 'Guide — Korea Travel Essentials',
};

export default function GuidePage() {
  return (
    <div className={styles.guidePage}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Your Complete Guide to <span>Korea</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Everything a first-timer (or repeat visitor) needs to know — transport, apps, money, food,
          and culture. All in one place. Curated from real traveler experiences.
        </p>
      </section>

      <div className={styles.contentGrid}>
        {/* Main content column */}
        <div className={styles.mainColumn}>
          {guideSections.map((section, idx) => (
            <section key={section.id} className={styles.section} id={section.id}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>{section.icon}</span>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
              </div>
              <p className={styles.sectionDesc}>{section.description}</p>
              <ul className={styles.itemList}>
                {section.items.map(item => (
                  <li key={item.title} className={styles.item}>
                    <h3 className={styles.itemTitle}>
                      {item.icon && <span>{item.icon}</span>}
                      {item.title}
                    </h3>
                    <div
                      className={styles.itemContent}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                  </li>
                ))}
              </ul>
              {/* In-content ad after 3rd section */}
              {idx === 2 && (
                <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
                  <AdBanner slot="rectangle" />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Sticky sidebar */}
        <aside className={styles.sideColumn}>
          <div className={styles.emergencyBox}>
            <p className={styles.emergencyTitle}>🆘 Emergency Numbers</p>
            {[
              { label: 'Police',               num: '112' },
              { label: 'Fire / Ambulance',     num: '119' },
              { label: 'Tourist Hotline (EN)', num: '1330' },
              { label: 'Coast Guard',          num: '122' },
            ].map(e => (
              <div key={e.label} className={styles.emergencyItem}>
                <span>{e.label}</span>
                <span className={styles.emergencyNum}>{e.num}</span>
              </div>
            ))}
          </div>

          <div className={styles.quickRef}>
            <p className={styles.quickRefTitle}>Quick Reference</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 2 }}>
              <li>💰 Currency: Korean Won (₩)</li>
              <li>🔌 Plug: Type C/F (220V)</li>
              <li>📶 5G: Nationwide coverage</li>
              <li>🗣 Language: Korean (한국어)</li>
              <li>🕐 Timezone: UTC+9 (KST)</li>
              <li>🏦 Tipping: Not customary</li>
            </ul>
          </div>

          <div className={styles.quickRef}>
            <p className={styles.quickRefTitle}>Popular Wiki Articles</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { slug: 'naver-map',         label: '🗺 Naver Map' },
                { slug: 't-money',           label: '💳 T-money Card' },
                { slug: 'kakao-t',           label: '🚕 KakaoT' },
                { slug: 'currency-exchange', label: '💱 Currency Exchange' },
                { slug: 'sim-card',          label: '📶 SIM Card' },
                { slug: 'korean-bbq',        label: '🔥 Korean BBQ' },
                { slug: 'norebang',          label: '🎤 Norebang' },
              ].map(link => (
                <li key={link.slug} style={{ marginBottom: '4px' }}>
                  <a
                    href={`/wiki/${link.slug}`}
                    style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-link)' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
