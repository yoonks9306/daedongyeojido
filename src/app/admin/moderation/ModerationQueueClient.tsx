'use client';

import { useMemo, useState } from 'react';

type PendingRevision = {
  id: number;
  revision_number: number;
  status: 'active' | 'pending' | 'hidden' | 'deleted';
  summary: string | null;
  author_name: string;
  created_at: string;
  article_slug: string;
  article_title: string;
};

type ReportRow = {
  id: number;
  target_type: string;
  target_id: number;
  reason: string;
  detail: string | null;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
  target_label: string;
  target_link: string | null;
};

export default function ModerationQueueClient({
  initialPendingRevisions,
  initialOpenReports,
}: {
  initialPendingRevisions: PendingRevision[];
  initialOpenReports: ReportRow[];
}) {
  const [pendingRevisions, setPendingRevisions] = useState(initialPendingRevisions);
  const [openReports, setOpenReports] = useState(initialOpenReports);
  const [busyReportId, setBusyReportId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingQuery, setPendingQuery] = useState('');
  const [reportQuery, setReportQuery] = useState('');
  const [pendingSort, setPendingSort] = useState<'oldest' | 'newest'>('oldest');

  const pendingCount = useMemo(() => pendingRevisions.filter((r) => r.status === 'pending').length, [pendingRevisions]);
  const filteredPending = useMemo(() => {
    const q = pendingQuery.trim().toLowerCase();
    const items = pendingRevisions.filter((r) => {
      if (!q) return true;
      return (
        r.article_title.toLowerCase().includes(q) ||
        r.article_slug.toLowerCase().includes(q) ||
        r.author_name.toLowerCase().includes(q) ||
        (r.summary ?? '').toLowerCase().includes(q)
      );
    });
    return [...items].sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return pendingSort === 'oldest' ? da - db : db - da;
    });
  }, [pendingQuery, pendingRevisions, pendingSort]);

  const filteredReports = useMemo(() => {
    const q = reportQuery.trim().toLowerCase();
    return openReports.filter((r) => {
      if (!q) return true;
      return (
        r.target_label.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        (r.detail ?? '').toLowerCase().includes(q)
      );
    });
  }, [openReports, reportQuery]);

  async function moderateReport(reportId: number, status: 'resolved' | 'dismissed') {
    setBusyReportId(reportId);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/v1/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error ?? `Request failed: ${res.status}`);
      }
      setOpenReports((prev) => prev.filter((report) => report.id !== reportId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setBusyReportId(null);
    }
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Moderation Queue</h1>
        <p className="text-sm text-muted-foreground">
          Pending revisions: {pendingCount} | Open reports: {openReports.length}
        </p>
        {errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}
      </header>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Pending Revisions</h2>
          <div className="flex items-center gap-2">
            <input
              value={pendingQuery}
              onChange={(e) => setPendingQuery(e.target.value)}
              placeholder="Filter by article/author/summary"
              className="h-9 w-72 rounded-md border border-border bg-background px-3 text-sm"
            />
            <select
              value={pendingSort}
              onChange={(e) => setPendingSort(e.target.value as 'oldest' | 'newest')}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm"
            >
              <option value="oldest">Oldest first</option>
              <option value="newest">Newest first</option>
            </select>
          </div>
        </div>
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="[&_th]:px-3 [&_th]:py-2 [&_th]:text-left">
                <th>Article</th>
                <th>Revision</th>
                <th>Author</th>
                <th>Created</th>
                <th>Summary</th>
                <th>Ticket</th>
              </tr>
            </thead>
            <tbody>
              {filteredPending.map((rev) => (
                <tr key={rev.id} className="border-t border-border/70 [&_td]:px-3 [&_td]:py-2 align-top">
                  <td>
                    <a href={`/wiki/${rev.article_slug}`} className="text-primary underline">
                      {rev.article_title}
                    </a>
                  </td>
                  <td>r{rev.revision_number}</td>
                  <td>{rev.author_name}</td>
                  <td>{new Date(rev.created_at).toLocaleString()}</td>
                  <td className="max-w-[360px] break-words text-muted-foreground">{rev.summary ?? '-'}</td>
                  <td>
                    <a
                      href={`/admin/moderation/revisions/${rev.id}`}
                      className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs hover:bg-muted/40"
                    >
                      Review Ticket
                    </a>
                  </td>
                </tr>
              ))}
              {filteredPending.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                    No pending revisions match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Open Reports</h2>
          <input
            value={reportQuery}
            onChange={(e) => setReportQuery(e.target.value)}
            placeholder="Filter by target/reason/detail"
            className="h-9 w-72 rounded-md border border-border bg-background px-3 text-sm"
          />
        </div>
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="[&_th]:px-3 [&_th]:py-2 [&_th]:text-left">
                <th>ID</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Detail</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-t border-border/70 [&_td]:px-3 [&_td]:py-2 align-top">
                  <td>#{report.id}</td>
                  <td>
                    {report.target_link ? (
                      <a href={report.target_link} className="text-primary underline">
                        {report.target_label}
                      </a>
                    ) : (
                      report.target_label
                    )}
                  </td>
                  <td>{report.reason}</td>
                  <td className="max-w-[360px] break-words text-muted-foreground">{report.detail ?? '-'}</td>
                  <td>{new Date(report.created_at).toLocaleString()}</td>
                  <td className="space-x-2">
                    <button
                      disabled={busyReportId === report.id}
                      onClick={() => moderateReport(report.id, 'resolved')}
                      className="inline-flex h-8 items-center rounded-md bg-primary px-2 text-xs text-primary-foreground disabled:opacity-50"
                    >
                      Resolve
                    </button>
                    <button
                      disabled={busyReportId === report.id}
                      onClick={() => moderateReport(report.id, 'dismissed')}
                      className="inline-flex h-8 items-center rounded-md border border-border px-2 text-xs disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                    No open reports match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
