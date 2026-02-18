import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { ensureUserProfile } from '@/lib/user-profiles';

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const actorId = await ensureCommunityAuthUser(session);
  const profile = await ensureUserProfile({
    userId: actorId,
    preferredUsername: session.user?.email?.split('@')[0] ?? session.user?.name ?? null,
    displayName: session.user?.name ?? null,
  });

  if (profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const error = new Error('Sentry manual verification event from /api/v1/admin/ops/sentry-test');
  const eventId = Sentry.captureException(error);
  await Sentry.flush(2000);

  return NextResponse.json({
    ok: true,
    eventId,
    message: 'Sentry test event captured. Check Sentry Issues/Events dashboard.',
  });
}
