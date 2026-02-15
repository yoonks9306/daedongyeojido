import { notFound } from 'next/navigation';
import { findTabByGroupId, guideTabs } from '@/data/guide-content';
import GuideExplorer from '../GuideExplorer';

interface Props {
  params: Promise<{ groupId: string }>;
}

export default async function GuideGroupPage({ params }: Props) {
  const { groupId } = await params;
  const tab = findTabByGroupId(groupId);
  if (!tab) notFound();

  return <GuideExplorer tabs={guideTabs} initialGroupId={groupId} />;
}
