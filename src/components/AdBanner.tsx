import styles from './AdBanner.module.css';

interface AdBannerProps {
  slot: 'leaderboard' | 'rectangle' | 'mobile';
  className?: string;
}

const SLOT_LABELS: Record<AdBannerProps['slot'], string> = {
  leaderboard: '728 × 90 — Leaderboard',
  rectangle:   '300 × 250 — Rectangle',
  mobile:      '320 × 50 — Mobile Banner',
};

export default function AdBanner({ slot, className }: AdBannerProps) {
  return (
    <div
      className={`${styles.adBanner} ${styles[slot]} ${className ?? ''}`}
      aria-label="Advertisement placeholder"
      role="complementary"
    >
      <span className={styles.adLabel}>{SLOT_LABELS[slot]}</span>
    </div>
  );
}
