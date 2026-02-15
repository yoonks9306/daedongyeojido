import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://daedongyeojido.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/wiki`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/community`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const { data: wikiRows } = await supabase.from('wiki_articles').select('slug, updated_at');
  const wikiPages: MetadataRoute.Sitemap = (wikiRows ?? []).map((row) => ({
    url: `${BASE_URL}/wiki/${row.slug}`,
    lastModified: row.updated_at ? new Date(row.updated_at) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const { data: communityRows } = await supabase.from('community_posts').select('id, updated_at');
  const communityPages: MetadataRoute.Sitemap = (communityRows ?? []).map((row) => ({
    url: `${BASE_URL}/community/${row.id}`,
    lastModified: row.updated_at ? new Date(row.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...wikiPages, ...communityPages];
}
