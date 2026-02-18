import type { Session } from 'next-auth';
import { ensureCommunityAuthUser } from '@/lib/community-auth-user';
import { ensureUserProfile, isStaffRole } from '@/lib/user-profiles';

export type RevisionStatus = 'active' | 'pending' | 'hidden' | 'deleted';

export type ViewerContext = {
  actorId: string | null;
  staff: boolean;
};

export async function resolveViewerContext(session: Session | null): Promise<ViewerContext> {
  if (!session?.user) {
    return { actorId: null, staff: false };
  }

  try {
    const actorId = await ensureCommunityAuthUser(session);
    const profile = await ensureUserProfile({
      userId: actorId,
      preferredUsername: session.user.email?.split('@')[0] ?? session.user.name ?? null,
      displayName: session.user.name ?? null,
    });

    return { actorId, staff: isStaffRole(profile.role) };
  } catch {
    return { actorId: null, staff: false };
  }
}

export function canViewRevision(params: {
  status: RevisionStatus;
  authorId: string | null;
  actorId: string | null;
  staff: boolean;
}): boolean {
  const { status, authorId, actorId, staff } = params;
  if (staff) return true;
  if (status === 'active') return true;
  if (status === 'pending' && actorId && authorId === actorId) return true;
  return false;
}
