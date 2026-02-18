import { supabaseAdmin } from '@/lib/supabase-admin';

export class EmergencyLockError extends Error {
  constructor() {
    super('Writes are temporarily disabled by emergency lock.');
    this.name = 'EmergencyLockError';
  }
}

export async function isEmergencyLocked(): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('emergency_lock')
    .eq('id', true)
    .maybeSingle<{ emergency_lock: boolean }>();

  if (error) {
    throw new Error(`Failed to read site settings: ${error.message}`);
  }

  return data?.emergency_lock === true;
}

export async function assertWritesAllowed() {
  if (await isEmergencyLocked()) {
    throw new EmergencyLockError();
  }
}
