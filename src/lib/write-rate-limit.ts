import { supabaseAdmin } from '@/lib/supabase-admin';

type RateLimitInput = {
  table: 'wiki_revisions' | 'reports' | 'community_posts' | 'comments' | 'media_uploads';
  actorColumn: string;
  actorId: string;
  windowSec: number;
  max: number;
};

export class WriteRateLimitError extends Error {
  status = 429;
  constructor(message: string) {
    super(message);
    this.name = 'WriteRateLimitError';
  }
}

export async function assertWriteRateLimit(input: RateLimitInput) {
  const sinceIso = new Date(Date.now() - input.windowSec * 1000).toISOString();

  const { count, error } = await supabaseAdmin
    .from(input.table)
    .select('*', { count: 'exact', head: true })
    .eq(input.actorColumn, input.actorId)
    .gte('created_at', sinceIso);

  if (error) {
    throw new Error(`Rate limit query failed for ${input.table}: ${error.message}`);
  }

  if ((count ?? 0) >= input.max) {
    throw new WriteRateLimitError(`Too many write actions. Limit: ${input.max} per ${input.windowSec} seconds.`);
  }
}
