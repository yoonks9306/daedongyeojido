import type { Metadata } from 'next';
import { guideTabs } from '@/data/guide-content';
import GuideExplorer from './guide/GuideExplorer';

export const metadata: Metadata = {
  title: 'Guide',
};

export default function GuidePage() {
  return <GuideExplorer tabs={guideTabs} initialGroupId={guideTabs[0]?.groups[0]?.id} />;
}
