import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureUserProfile } from '@/lib/user-profiles';

type Body = {
  locked?: unknown;
};

export async function GET() {
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

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('emergency_lock, updated_at, updated_by')
    .eq('id', true)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    emergencyLock: data?.emergency_lock === true,
    updatedAt: data?.updated_at ?? null,
    updatedBy: data?.updated_by ?? null,
  });
}

export async function PATCH(request: Request) {
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

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.locked !== 'boolean') {
    return NextResponse.json({ error: 'locked (boolean) is required.' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .update({
      emergency_lock: body.locked,
      updated_by: actorId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', true)
    .select('emergency_lock, updated_at, updated_by')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    emergencyLock: data.emergency_lock === true,
    updatedAt: data.updated_at,
    updatedBy: data.updated_by,
  });
}
