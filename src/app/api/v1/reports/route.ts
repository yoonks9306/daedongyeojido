import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';
import { assertWriteRateLimit, WriteRateLimitError } from '@/lib/write-rate-limit';

const VALID_TARGET_TYPES = new Set(['article', 'revision', 'post', 'comment', 'user']);
const VALID_REASONS = new Set(['spam', 'vandalism', 'inappropriate', 'misinformation', 'other']);

type CreateReportBody = {
  targetType?: unknown;
  targetId?: unknown;
  reason?: unknown;
  detail?: unknown;
};

type ListScope = 'mine' | 'all';

function parseScope(raw: string | null): ListScope {
  if (raw === 'all') return 'all';
  return 'mine';
}

export async function GET(request: Request) {
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

  const url = new URL(request.url);
  const scope = parseScope(url.searchParams.get('scope'));
  const requestedStatus = url.searchParams.get('status');

  let query = supabaseAdmin
    .from('reports')
    .select('id, reporter_id, target_type, target_id, reason, detail, status, resolved_by, resolved_at, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (scope === 'all') {
    if (!isStaffRole(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } else {
    query = query.eq('reporter_id', actorId);
  }

  if (requestedStatus && ['open', 'resolved', 'dismissed'].includes(requestedStatus)) {
    query = query.eq('status', requestedStatus);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reports: data ?? [] });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: CreateReportBody;
  try {
    body = (await request.json()) as CreateReportBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const targetType = typeof body.targetType === 'string' ? body.targetType : '';
  const reason = typeof body.reason === 'string' ? body.reason : '';
  const targetId = typeof body.targetId === 'number' && Number.isInteger(body.targetId) ? body.targetId : NaN;
  const detail = typeof body.detail === 'string' ? body.detail.trim() : '';

  if (!VALID_TARGET_TYPES.has(targetType)) {
    return NextResponse.json({ error: 'Invalid target type.' }, { status: 400 });
  }
  if (!Number.isFinite(targetId) || targetId <= 0) {
    return NextResponse.json({ error: 'Invalid target id.' }, { status: 400 });
  }
  if (!VALID_REASONS.has(reason)) {
    return NextResponse.json({ error: 'Invalid reason.' }, { status: 400 });
  }
  if (detail.length > 1000) {
    return NextResponse.json({ error: 'detail must be 1000 characters or less.' }, { status: 400 });
  }

  try {
    await assertWritesAllowed();
    const reporterId = await ensureCommunityAuthUser(session);
    await assertWriteRateLimit({
      table: 'reports',
      actorColumn: 'reporter_id',
      actorId: reporterId,
      windowSec: 3600,
      max: 20,
    });
    await ensureUserProfile({
      userId: reporterId,
      preferredUsername: session.user?.email?.split('@')[0] ?? session.user?.name ?? null,
      displayName: session.user?.name ?? null,
    });

    const { data, error } = await supabaseAdmin
      .from('reports')
      .insert({
        reporter_id: reporterId,
        target_type: targetType,
        target_id: targetId,
        reason,
        detail: detail || null,
      })
      .select('id')
      .single<{ id: number }>();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    if (error instanceof EmergencyLockError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error instanceof WriteRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
