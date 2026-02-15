import type { Session } from 'next-auth';
import { supabaseAdmin } from '@/lib/supabase-admin';

type IdentityRow = {
  nextauth_subject: string;
  supabase_user_id: string;
};

function getSubject(session: Session): string | null {
  if (session.user?.id) return session.user.id;
  if (session.user?.email) return `email:${session.user.email}`;
  return null;
}

async function findSupabaseUserIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return null;

  const existing = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
  return existing?.id ?? null;
}

async function ensureIdentityTable() {
  // Table creation is managed in schema.sql; this is a soft guard.
  const { error } = await supabaseAdmin
    .from('user_identities')
    .select('nextauth_subject')
    .limit(1);
  if (error) {
    throw new Error('Missing table public.user_identities. Run updated supabase/schema.sql first.');
  }
}

export async function ensureCommunityAuthUser(session: Session): Promise<string> {
  const subject = getSubject(session);
  const email = session.user?.email ?? null;

  if (!subject || !email) {
    throw new Error('Authenticated session is missing required user identity fields.');
  }

  await ensureIdentityTable();

  const { data: existingIdentity, error: lookupError } = await supabaseAdmin
    .from('user_identities')
    .select('nextauth_subject, supabase_user_id')
    .eq('nextauth_subject', subject)
    .maybeSingle<IdentityRow>();

  if (lookupError) {
    throw new Error(`Failed to lookup user identity: ${lookupError.message}`);
  }

  if (existingIdentity?.supabase_user_id) {
    return existingIdentity.supabase_user_id;
  }

  let supabaseUserId = await findSupabaseUserIdByEmail(email);

  if (!supabaseUserId) {
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name: session.user?.name ?? null,
      },
    });

    if (createError || !created.user?.id) {
      throw new Error(`Failed to create Supabase user: ${createError?.message ?? 'Unknown error'}`);
    }

    supabaseUserId = created.user.id;
  }

  const { error: upsertError } = await supabaseAdmin
    .from('user_identities')
    .upsert(
      {
        nextauth_subject: subject,
        email,
        supabase_user_id: supabaseUserId,
      },
      {
        onConflict: 'nextauth_subject',
      }
    );

  if (upsertError) {
    throw new Error(`Failed to persist user identity: ${upsertError.message}`);
  }

  return supabaseUserId;
}
