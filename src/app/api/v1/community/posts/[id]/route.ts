import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAILS = ['yoonks9306@gmail.com'];

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const postId = Number.parseInt(id, 10);
  if (!Number.isFinite(postId) || postId <= 0) {
    return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('community_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
