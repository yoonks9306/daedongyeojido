import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { ensureUserProfile } from '@/lib/user-profiles';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';

type Body = {
  confirm?: unknown;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.confirm !== true) {
    return NextResponse.json({ error: 'confirm=true is required.' }, { status: 400 });
  }

  try {
    await assertWritesAllowed();
  } catch (error) {
    if (error instanceof EmergencyLockError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const actorId = await ensureCommunityAuthUser(session);
  await ensureUserProfile({
    userId: actorId,
    preferredUsername: session.user?.email?.split('@')[0] ?? session.user?.name ?? null,
    displayName: session.user?.name ?? null,
  });

  const deletedAt = new Date().toISOString();
  const retentionDays = 30;
  const purgeAfter = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000).toISOString();

  const { error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .update({
      deleted_at: deletedAt,
      updated_at: deletedAt,
      display_name: 'Deleted User',
    })
    .eq('user_id', actorId);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (session.user.email) {
    await supabaseAdmin
      .from('local_auth_users')
      .update({ username: `deleted_${actorId.slice(0, 8)}` })
      .eq('email', session.user.email.toLowerCase());
  }

  return NextResponse.json({
    status: 'soft_deleted',
    deletedAt,
    retentionDays,
    purgeAfter,
    message: 'Account marked for deletion. Login/write access should now be blocked.',
  });
}
