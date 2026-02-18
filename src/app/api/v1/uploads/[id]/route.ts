import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateBody = {
  status?: unknown;
};

const ALLOWED_STATUS = new Set(['removed', 'blocked']);

function toId(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export async function PATCH(request: Request, context: RouteContext) {
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

  const { id: rawId } = await context.params;
  const id = toId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'Invalid upload id.' }, { status: 400 });
  }

  let body: UpdateBody;
  try {
    body = (await request.json()) as UpdateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const status = typeof body.status === 'string' ? body.status : '';
  if (!ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ error: 'status must be one of: removed, blocked' }, { status: 400 });
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

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('media_uploads')
    .select('id, uploader_id, status')
    .eq('id', id)
    .maybeSingle<{ id: number; uploader_id: string; status: string }>();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Upload not found.' }, { status: 404 });
  }

  const staff = isStaffRole(profile.role);
  const owner = existing.uploader_id === actorId;
  if (!staff && !owner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (status === 'blocked' && !staff) {
    return NextResponse.json({ error: 'Only staff can set blocked status.' }, { status: 403 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('media_uploads')
    .update({ status })
    .eq('id', id)
    .select('id, uploader_id, status, created_at')
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ upload: updated });
}
