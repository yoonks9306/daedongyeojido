/**
 * Seed script: inserts static data from src/data/ into Supabase.
 * Run: npx tsx supabase/seed.ts
 */
import { createClient } from '@supabase/supabase-js';
import { wikiArticles } from '../src/data/wiki-articles';
import { communityPosts } from '../src/data/community-posts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedWikiArticles() {
  console.log(`Seeding ${wikiArticles.length} wiki articles...`);
  const rows = wikiArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    summary: a.summary,
    infobox: a.infobox ?? null,
    content: a.content,
    related_articles: a.relatedArticles,
    tags: a.tags,
    last_updated: a.lastUpdated,
  }));

  const { error } = await supabase.from('wiki_articles').upsert(rows, { onConflict: 'slug' });
  if (error) {
    console.error('wiki_articles seed error:', error.message);
  } else {
    console.log(`  wiki_articles: ${rows.length} rows upserted.`);
  }
}

async function seedCommunityPosts() {
  console.log(`Seeding ${communityPosts.length} community posts...`);
  const rows = communityPosts.map((p) => ({
    title: p.title,
    content: p.content,
    author_id: null,
    author_name: p.author,
    category: p.category,
    upvotes: p.upvotes,
    views: p.views,
    comment_count: p.comments,
    tags: p.tags,
    created_at: new Date(p.createdAt).toISOString(),
  }));

  const { error } = await supabase.from('community_posts').insert(rows);
  if (error) {
    console.error('community_posts seed error:', error.message);
  } else {
    console.log(`  community_posts: ${rows.length} rows inserted.`);
  }
}

async function main() {
  await seedWikiArticles();
  await seedCommunityPosts();
  console.log('Seed complete.');
}

main();
