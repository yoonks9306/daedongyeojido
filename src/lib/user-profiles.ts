import { supabaseAdmin } from '@/lib/supabase-admin';

type UserRole = 'user' | 'moderator' | 'admin';

type UserProfileRow = {
  user_id: string;
  username: string;
  display_name: string | null;
  trust_score: number;
  role: UserRole;
  banned_until?: string | null;
  deleted_at?: string | null;
};

export type UserProfile = UserProfileRow;
export type UserProfileRole = UserRole;

export class DeletedAccountError extends Error {
  constructor() {
    super('This account is deleted and can no longer perform this action.');
    this.name = 'DeletedAccountError';
  }
}

export class BannedAccountError extends Error {
  constructor() {
    super('This account is temporarily restricted from performing this action.');
    this.name = 'BannedAccountError';
  }
}

function sanitizeUsername(value: string): string {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!sanitized) return '';
  if (sanitized.length < 3) return `${sanitized}_user`.slice(0, 20);
  return sanitized.slice(0, 20);
}

function baseUsername(userId: string, preferred?: string | null): string {
  const fromPreferred = sanitizeUsername(preferred ?? '');
  if (fromPreferred) return fromPreferred;
  return `user_${userId.replace(/-/g, '').slice(0, 8)}`;
}

function randomSuffix(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export async function ensureUserProfile(params: {
  userId: string;
  preferredUsername?: string | null;
  displayName?: string | null;
}): Promise<UserProfileRow> {
  const { userId, preferredUsername, displayName } = params;

  const { data: existing, error: existingError } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, username, display_name, trust_score, role, banned_until, deleted_at')
    .eq('user_id', userId)
    .maybeSingle<UserProfileRow>();

  if (existingError) {
    throw new Error(`Failed to lookup user profile: ${existingError.message}`);
  }

  if (existing) return existing;

  const base = baseUsername(userId, preferredUsername);

  for (let attempt = 0; attempt < 5; attempt++) {
    const username = attempt === 0 ? base : `${base}_${randomSuffix()}`.slice(0, 30);

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: userId,
        username,
        display_name: displayName ?? null,
      })
      .select('user_id, username, display_name, trust_score, role, banned_until, deleted_at')
      .single<UserProfileRow>();

    if (!error && data) return data;

    if (error?.code !== '23505') {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  }

  throw new Error('Could not allocate unique username for user profile.');
}

export async function getUserProfile(userId: string): Promise<UserProfileRow | null> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('user_id, username, display_name, trust_score, role, banned_until, deleted_at')
    .eq('user_id', userId)
    .maybeSingle<UserProfileRow>();

  if (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
  return data ?? null;
}

export function isStaffRole(role: UserRole): boolean {
  return role === 'moderator' || role === 'admin';
}

export function assertProfileWritable(profile: { deleted_at?: string | null; banned_until?: string | null }) {
  if (profile.deleted_at) {
    throw new DeletedAccountError();
  }

  if (profile.banned_until) {
    const until = new Date(profile.banned_until).getTime();
    if (Number.isFinite(until) && until > Date.now()) {
      throw new BannedAccountError();
    }
  }
}
