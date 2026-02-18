'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ModerationRevisionReviewClient({ revisionId }: { revisionId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: 'approve' | 'reject' | 'hold') {
    if (action === 'approve') {
      const ok = window.confirm('Approve this revision and publish it as the latest version?');
      if (!ok) return;
    }
    if (action === 'reject') {
      const ok = window.confirm('Reject this revision? It will be removed from pending queue.');
      if (!ok) return;
    }
    if (action === 'hold') {
      const ok = window.confirm('Keep this revision pending for later review?');
      if (!ok) return;
    }

    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/wiki/revisions/${revisionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error ?? `Request failed: ${res.status}`);
      }
      router.push('/admin/moderation');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleAction('approve')}
          disabled={busy}
          className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm text-primary-foreground disabled:opacity-50"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => handleAction('reject')}
          disabled={busy}
          className="inline-flex h-9 items-center rounded-md border border-destructive/40 px-3 text-sm text-destructive disabled:opacity-50"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => handleAction('hold')}
          disabled={busy}
          className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm disabled:opacity-50"
        >
          Hold
        </button>
      </div>
    </div>
  );
}
