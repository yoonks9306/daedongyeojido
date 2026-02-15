'use client';

import { useEffect, useRef } from 'react';
import styles from './AdBanner.module.css';

interface AdBannerProps {
  slot: 'leaderboard' | 'rectangle' | 'mobile';
  className?: string;
}

const SLOT_STYLE: Record<AdBannerProps['slot'], React.CSSProperties> = {
  leaderboard: { display: 'block', width: '728px', height: '90px', maxWidth: '100%' },
  rectangle:   { display: 'block', width: '300px', height: '250px', maxWidth: '100%' },
  mobile:      { display: 'block', width: '320px', height: '50px', maxWidth: '100%' },
};

export default function AdBanner({ slot, className }: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded or blocked by ad blocker
    }
  }, []);

  return (
    <div className={`${styles.adBanner} ${styles[slot]} ${className ?? ''}`}>
      <ins
        className="adsbygoogle"
        style={SLOT_STYLE[slot]}
        data-ad-client="ca-pub-1126883662685001"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
