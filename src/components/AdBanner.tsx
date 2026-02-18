'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  slot: 'leaderboard' | 'rectangle' | 'mobile';
  className?: string;
}

const SLOT_STYLE: Record<AdBannerProps['slot'], React.CSSProperties> = {
  leaderboard: { display: 'block', width: '728px', height: '90px', maxWidth: '100%' },
  rectangle:   { display: 'block', width: '300px', height: '250px', maxWidth: '100%' },
  mobile:      { display: 'block', width: '320px', height: '50px', maxWidth: '100%' },
};

const SLOT_SIZE: Record<AdBannerProps['slot'], string> = {
  leaderboard: 'w-[728px] h-[90px]',
  rectangle: 'w-[300px] h-[250px]',
  mobile: 'w-[320px] h-[50px]',
};

const SLOT_LABEL: Record<AdBannerProps['slot'], string> = {
  leaderboard: '728 x 90 Leaderboard',
  rectangle: '300 x 250 Sidebar Ad',
  mobile: '320 x 50 Mobile Ad',
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
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden shrink-0 relative border border-dashed border-border rounded-sm bg-card dark:bg-background max-w-full',
        SLOT_SIZE[slot],
        className
      )}
      data-slot={slot}
    >
      <ins
        className="adsbygoogle relative z-[1]"
        style={SLOT_STYLE[slot]}
        data-ad-client="ca-pub-1126883662685001"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <span className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs tracking-wide pointer-events-none" aria-hidden="true">
        {SLOT_LABEL[slot]}
      </span>
    </div>
  );
}
