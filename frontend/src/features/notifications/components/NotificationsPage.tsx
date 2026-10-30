import { useEffect, useState } from 'react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { apiClient } from '@/lib/axios';
import { Inbox, RefreshCw } from 'lucide-react';

interface NotificationJobRecord {
  id: string;
  category: string;
  scheduledAt: string;
  status: string;
  retryCount: number;
  attempts: Array<{ channel: string; status: string; attemptedAt: string; failureReason?: string | null }>;
}

export function NotificationsPage() {
  const [jobs, setJobs] = useState<NotificationJobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    try { const { data } = await apiClient.get('/notifications/preferences/history'); setJobs(data); }
    catch (err: any) { setError(err.response?.data?.message || 'Notification history is unavailable.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  return <div className="h-full flex flex-col animate-in fade-in duration-500 pb-20">
    <SectionHeader title="Notification Activity" subtitle="Persistent notification job and delivery-attempt status for your account." action={<button type="button" onClick={() => void load()} className="flex items-center gap-2 text-sm font-bold text-primary"><RefreshCw className="h-4 w-4" />Refresh</button>} />
    {error && <div role="alert" className="mb-4 rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</div>}
    <div className="glass flex-1 rounded-xl border border-border p-4">
      {loading ? <p className="p-6 text-center text-sm text-text-secondary">Loading notification activity…</p> : jobs.length === 0 ? <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
        <Inbox className="mb-4 h-10 w-10 text-text-secondary" />
        <h2 className="font-bold text-text-primary">No notification jobs recorded</h2>
        <p className="mt-2 max-w-md text-sm text-text-secondary">No delivery has been reported. Configure channels and consent in Account Settings; external messages are not sent without channel consent.</p>
      </div> : <div className="space-y-3">{jobs.map((job) => <article key={job.id} className="rounded-lg border border-border bg-surface/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="font-bold capitalize text-text-primary">{job.category.replaceAll('_', ' ')}</h2><p className="mt-1 text-xs text-text-secondary">Scheduled {new Date(job.scheduledAt).toLocaleString()}</p></div>
          <span className="rounded-full bg-surface px-3 py-1 text-xs capitalize text-text-secondary">{job.status.replaceAll('_', ' ')}</span>
        </div>
        {job.attempts.length > 0 ? <ul className="mt-3 space-y-2 border-t border-border pt-3">{job.attempts.map((attempt, i) => <li key={`${job.id}-${i}`} className="text-xs text-text-secondary">
          {attempt.channel} · {attempt.status} · {new Date(attempt.attemptedAt).toLocaleString()}{attempt.failureReason ? ` · ${attempt.failureReason}` : ''}
        </li>)}</ul> : <p className="mt-3 border-t border-border pt-3 text-xs text-text-secondary">No delivery attempt has been recorded. A queued job is not a sent message.</p>}
      </article>)}</div>}
    </div>
  </div>;
}
