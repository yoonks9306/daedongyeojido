import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';

type RouteContext = {
  params: Promise<{ id: string }>;
};

type UpdateReportBody = {
  status?: unknown;
  detail?: unknown;
};

const VALID_STATUS = new Set(['open', 'resolved', 'dismissed']);

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

  if (!isStaffRole(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id: rawId } = await context.params;
  const id = toId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'Invalid report id.' }, { status: 400 });
  }

  let body: UpdateReportBody;
  try {
    body = (await request.json()) as UpdateReportBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const status = typeof body.status === 'string' ? body.status : '';
  const detail = typeof body.detail === 'string' ? body.detail.trim() : '';

  if (!VALID_STATUS.has(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
  }
  if (detail.length > 1000) {
    return NextResponse.json({ error: 'detail must be 1000 characters or less.' }, { status: 400 });
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

  const patch: Record<string, unknown> = {
    status,
    resolved_by: actorId,
    resolved_at: status === 'open' ? null : new Date().toISOString(),
  };
  if (detail) {
    patch.detail = detail;
  }

  const { data, error } = await supabaseAdmin
    .from('reports')
    .update(patch)
    .eq('id', id)
    .select('id, status, resolved_by, resolved_at, detail')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ report: data });
}
