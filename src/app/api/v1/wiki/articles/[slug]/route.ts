import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isValidWikiCategory, slugifyWikiTitle } from '@/lib/wiki-utils';

type WikiRouteContext = {
  params: Promise<{ slug: string }>;
};

type UpdateWikiBody = {
  title?: unknown;
  category?: unknown;
  summary?: unknown;
  content?: unknown;
  tags?: unknown;
  relatedArticles?: unknown;
};

export async function PATCH(request: Request, context: WikiRouteContext) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await context.params;
  if (!slug) {
    return NextResponse.json({ error: 'Missing article slug.' }, { status: 400 });
  }

  let body: UpdateWikiBody;
  try {
    body = (await request.json()) as UpdateWikiBody;
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
    ? body.relatedArticles.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean).slice(0, 30)
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

  const newSlug = slugifyWikiTitle(title);
  if (!newSlug) {
    return NextResponse.json({ error: 'Could not generate a valid slug from title.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('wiki_articles')
    .update({
      slug: newSlug,
      title,
      category,
      summary,
      content,
      tags,
      related_articles: relatedArticles,
      last_updated: new Date().toISOString().slice(0, 10),
    })
    .eq('slug', slug)
    .select('slug')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'An article with that slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
  }

  return NextResponse.json({ slug: data.slug });
}
