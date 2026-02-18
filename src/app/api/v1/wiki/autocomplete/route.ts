import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

type Row = {
  slug: string;
  title: string;
  category: string;
};

function parseLimit(raw: string | null): number {
  if (!raw) return 8;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return 8;
  return Math.min(Math.max(n, 1), 20);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  const limit = parseLimit(url.searchParams.get('limit'));

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const pattern = `*${q}*`;
  const [titleRes, slugRes] = await Promise.all([
    supabaseAdmin
      .from('wiki_articles')
      .select('slug,title,category')
      .ilike('title', pattern)
      .order('title', { ascending: true })
      .limit(limit),
    supabaseAdmin
      .from('wiki_articles')
      .select('slug,title,category')
      .ilike('slug', pattern)
      .order('title', { ascending: true })
      .limit(limit),
  ]);

  if (titleRes.error) {
    return NextResponse.json({ error: titleRes.error.message }, { status: 500 });
  }
  if (slugRes.error) {
    return NextResponse.json({ error: slugRes.error.message }, { status: 500 });
  }

  const lower = q.toLowerCase();
  const merged = new Map<string, Row>();
  for (const item of (titleRes.data ?? []) as Row[]) {
    merged.set(item.slug, item);
  }
  for (const item of (slugRes.data ?? []) as Row[]) {
    merged.set(item.slug, item);
  }

  const ranked = Array.from(merged.values())
    .sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aScore = aTitle === lower ? 0 : aTitle.startsWith(lower) ? 1 : 2;
      const bScore = bTitle === lower ? 0 : bTitle.startsWith(lower) ? 1 : 2;
      if (aScore !== bScore) return aScore - bScore;
      return a.title.localeCompare(b.title);
    })
    .slice(0, limit);

  return NextResponse.json({ results: ranked });
}
