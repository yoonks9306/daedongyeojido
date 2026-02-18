import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { ensureUserProfile } from '@/lib/user-profiles';
import { assertWritesAllowed, EmergencyLockError } from '@/lib/emergency-lock';
import { assertWriteRateLimit, WriteRateLimitError } from '@/lib/write-rate-limit';

const BUCKET = 'community-media';
const MAX_BYTES = 5 * 1024 * 1024;
const DAILY_QUOTA = 20;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  try {
    await assertWriteRateLimit({
      table: 'media_uploads',
      actorColumn: 'uploader_id',
      actorId,
      windowSec: 600,
      max: 10,
    });
  } catch (error) {
    if (error instanceof WriteRateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const form = await request.formData();
  const maybeFile = form.get('file');
  if (!(maybeFile instanceof File)) {
    return NextResponse.json({ error: 'Missing file in form-data.' }, { status: 400 });
  }

  const file = maybeFile;
  if (!ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type. Allowed: jpeg/png/webp/gif.' }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File size must be between 1 byte and 5MB.' }, { status: 400 });
  }

  const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error: countError } = await supabaseAdmin
    .from('media_uploads')
    .select('*', { count: 'exact', head: true })
    .eq('uploader_id', actorId)
    .eq('status', 'active')
    .gte('created_at', sinceIso);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }
  if ((count ?? 0) >= DAILY_QUOTA) {
    return NextResponse.json({ error: `Daily upload quota exceeded (${DAILY_QUOTA}).` }, { status: 429 });
  }

  const ext = file.type.split('/')[1] ?? 'bin';
  const safeExt = ext.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  const path = `${actorId}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${safeExt}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: row, error: insertError } = await supabaseAdmin
    .from('media_uploads')
    .insert({
      uploader_id: actorId,
      path,
      mime: file.type,
      size_bytes: file.size,
      status: 'active',
    })
    .select('id, path, mime, size_bytes, status, created_at')
    .single();

  if (insertError) {
    await supabaseAdmin.storage.from(BUCKET).remove([path]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json(
    {
      upload: row,
      publicUrl: publicUrlData.publicUrl,
    },
    { status: 201 }
  );
}
