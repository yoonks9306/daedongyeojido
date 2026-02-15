import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { isValidWikiCategory, slugifyWikiTitle } from '@/lib/wiki-utils';

type CreateWikiBody = {
  title?: unknown;
  category?: unknown;
  summary?: unknown;
  content?: unknown;
  tags?: unknown;
  relatedArticles?: unknown;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: CreateWikiBody;
  try {
    body = (await request.json()) as CreateWikiBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const category = typeof body.category === 'string' ? body.category : '';
  const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';
  const tags = Array.isArray(body.tags)
    ? body.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => tag.trim()).filter(Boolean).slice(0, 20)
    : [];
  const relatedArticles = Array.isArray(body.relatedArticles)
    ? body.relatedArticles.filter((slug): slug is string => typeof slug === 'string').map((slug) => slug.trim()).filter(Boolean).slice(0, 30)
    : [];

  if (!title || title.length > 120) {
    return NextResponse.json({ error: 'Title is required and must be 120 characters or less.' }, { status: 400 });
  }
  if (!isValidWikiCategory(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 });
  }
  if (!summary || summary.length > 300) {
    return NextResponse.json({ error: 'Summary is required and must be 300 characters or less.' }, { status: 400 });
  }
  if (!content || content.length > 40000) {
    return NextResponse.json({ error: 'Content is required and must be 40000 characters or less.' }, { status: 400 });
  }

  const slug = slugifyWikiTitle(title);
  if (!slug) {
    return NextResponse.json({ error: 'Could not generate a valid slug from title.' }, { status: 400 });
  }

  try {
    const authorId = await ensureCommunityAuthUser(session);

    const { data, error } = await supabaseAdmin
      .from('wiki_articles')
      .insert({
        slug,
        title,
        category,
        summary,
        content,
        tags,
        related_articles: relatedArticles,
        infobox: null,
        last_updated: new Date().toISOString().slice(0, 10),
        author_id: authorId,
      })
      .select('slug')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'An article with that slug already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ slug: data.slug }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
