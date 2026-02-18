'use client';

import Link from 'next/link';
import { useState } from 'react';

type Row = {
  id: number;
  revisionNumber: number;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
  authorName: string;
  createdAt: string;
  deltaAdded: number;
  deltaRemoved: number;
};

export default function HistoryListClient({
  slug,
  rows,
  canRevert,
}: {
  slug: string;
  rows: Row[];
  canRevert: boolean;
}) {
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function revertRevision(revisionId: number) {
    const confirmed = window.confirm(
      'Warning: Reverting to an older revision creates a new revision and may override later contributors\' work. Continue?'
    );
    if (!confirmed) return;

    setBusyId(revisionId);
    setError(null);
    try {
      const res = await fetch(`/api/v1/wiki/revisions/${revisionId}/revert`, { method: 'POST' });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error ?? `Request failed (${res.status})`);
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-3">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <ul className="space-y-2">
        {rows.map((row) => {
          const deltaColor = row.deltaAdded - row.deltaRemoved >= 0 ? 'text-green-500' : 'text-red-500';
          const deltaPrefix = row.deltaAdded - row.deltaRemoved >= 0 ? '+' : '';
          const net = row.deltaAdded - row.deltaRemoved;
          return (
            <li key={row.id} className="text-base">
              <span className="text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</span>
              {' '}
              <span className="text-primary">
                (
                <Link href={`/wiki/${slug}?rev=${row.revisionNumber}`} className="hover:underline">View</Link>
                {' | '}
                <Link href={`/wiki/${slug}/raw?rev=${row.revisionNumber}`} className="hover:underline">RAW</Link>
                {' | '}
                <Link href={`/wiki/${slug}/blame?rev=${row.revisionNumber}`} className="hover:underline">Blame</Link>
                {' | '}
                {canRevert ? (
                  <button
                    className="hover:underline disabled:opacity-50"
                    disabled={busyId === row.id}
                    onClick={() => revertRevision(row.id)}
                  >
                    Revert
                  </button>
                ) : (
                  <span className="opacity-60">Revert</span>
                )}
                {' | '}
                <Link href={`/wiki/${slug}/compare?old=${Math.max(1, row.revisionNumber - 1)}&new=${row.revisionNumber}`} className="hover:underline">Compare</Link>
                )
              </span>
              {' '}
              <span className="font-semibold">r{row.revisionNumber}</span>
              {' '}
              <span className={deltaColor}>
                ({deltaPrefix}{net})
              </span>
              {' '}
              <span className="text-primary font-bold">{row.authorName}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
