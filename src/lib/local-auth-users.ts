import { supabaseAdmin } from '@/lib/supabase-admin';
import { hashPassword, verifyPassword } from '@/lib/password';

export type LocalAuthUser = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getLocalAuthUserByEmail(email: string): Promise<LocalAuthUser | null> {
  const normalized = normalizeEmail(email);

  const { data, error } = await supabaseAdmin
    .from('local_auth_users')
    .select('id, email, username, password_hash')
    .eq('email', normalized)
    .maybeSingle<LocalAuthUser>();

  if (error) {
    throw new Error(`Failed to load local auth user: ${error.message}`);
  }

  return data ?? null;
}

export async function createLocalAuthUser(input: {
  email: string;
  username: string;
  password: string;
}): Promise<{ id: string; email: string; username: string }> {
  const email = normalizeEmail(input.email);
  const username = input.username.trim();
  const passwordHash = hashPassword(input.password);

  const { data, error } = await supabaseAdmin
    .from('local_auth_users')
    .insert({
      email,
      username,
      password_hash: passwordHash,
    })
    .select('id, email, username')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function verifyLocalAuthUserCredentials(input: {
  email: string;
  password: string;
}): Promise<{ id: string; email: string; username: string } | null> {
  const user = await getLocalAuthUserByEmail(input.email);
  if (!user) return null;

  const matches = verifyPassword(input.password, user.password_hash);
  if (!matches) return null;

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
}
