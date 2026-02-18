import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type SearchRow = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  updated_at: string;
  score: number;
  trigram_similarity: number;
};

function parseLimit(raw: string | null): number {
  if (!raw) return 10;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return 10;
  return Math.min(Math.max(n, 1), 50);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const limit = parseLimit(url.searchParams.get('limit'));

  if (!q) {
    return NextResponse.json({ error: 'q is required.' }, { status: 400 });
  }
  if (q.length > 120) {
    return NextResponse.json({ error: 'q must be 120 characters or less.' }, { status: 400 });
  }

  const lowerQ = q.toLowerCase();
  const { data, error } = await supabaseAdmin.rpc('search_wiki_advanced', {
    search_query: q,
    max_results: limit,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = ((data ?? []) as SearchRow[]).map((row) => {
    const titleLower = row.title.toLowerCase();
    const reasons: string[] = [];

    if (titleLower === lowerQ) reasons.push('title_exact');
    else if (titleLower.startsWith(lowerQ)) reasons.push('title_prefix');

    if (row.trigram_similarity >= 0.45) reasons.push('title_trigram_high');
    else if (row.trigram_similarity >= 0.25) reasons.push('title_trigram_match');

    reasons.push('fts_ranked');

    return {
      slug: row.slug,
      title: row.title,
      category: row.category,
      summary: row.summary,
      updatedAt: row.updated_at,
      score: row.score,
      trigramSimilarity: row.trigram_similarity,
      reasons,
    };
  });

  return NextResponse.json({ results });
}
