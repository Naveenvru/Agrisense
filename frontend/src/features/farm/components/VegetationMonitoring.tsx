import { useEffect, useMemo, useState } from 'react';
import { Activity, Satellite, RefreshCw } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FarmService } from '../services/FarmService';

type Parcel = { id: string; name: string; hasBoundary: boolean };
type Observation = { id: string; acquisitionDate: string; meanNdvi: number; minNdvi: number; maxNdvi: number; cloudCoveragePercent: number | null; satellite: string; validPixelCount: number };

function category(value: number) {
  if (value < 0.1) return 'Very low vegetation signal';
  if (value < 0.25) return 'Low vegetation signal';
  if (value < 0.5) return 'Moderate vegetation signal';
  return 'High vegetation signal';
}

export function VegetationMonitoring({ parcels }: { parcels: Parcel[] }) {
  const eligible = useMemo(() => parcels.filter((parcel) => parcel.hasBoundary), [parcels]);
  const [parcelId, setParcelId] = useState('');
  const [observations, setObservations] = useState<Observation[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10));

  useEffect(() => { if (!eligible.some((parcel) => parcel.id === parcelId)) setParcelId(eligible[0]?.id || ''); }, [eligible, parcelId]);
  useEffect(() => {
    if (!parcelId) { setObservations([]); setJobs([]); return; }
    let stale = false;
    setLoading(true); setError('');
    FarmService.getVegetation(parcelId).then((data) => {
      if (stale) return;
      setObservations(data?.observations || []); setJobs(data?.jobs || []); setConfigured(Boolean(data?.providerConfigured));
    }).catch((cause: any) => { if (!stale) setError(cause.response?.data?.message || 'Vegetation history could not be loaded.'); })
      .finally(() => { if (!stale) setLoading(false); });
    return () => { stale = true; };
  }, [parcelId]);
  useEffect(() => {
    if (!jobs.some((job) => ['queued', 'processing'].includes(job.status))) return;
    const timer = window.setInterval(() => {
      if (!parcelId) return;
      void FarmService.getVegetation(parcelId).then((data) => { setObservations(data?.observations || []); setJobs(data?.jobs || []); setConfigured(Boolean(data?.providerConfigured)); }).catch(() => undefined);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [jobs, parcelId]);

  const request = async () => {
    if (!parcelId) return;
    setRequesting(true); setError(''); setMessage('');
    try {
      const job = await FarmService.requestVegetation(parcelId, dateFrom, dateTo);
      setJobs((current) => [job, ...current.filter((entry) => String(entry.id) !== String(job.id))]);
      setMessage('Satellite processing job queued. Results appear here only after the provider returns usable, cloud-masked imagery.');
    } catch (cause: any) { setError(cause.response?.data?.message || 'Could not queue satellite processing.'); }
    finally { setRequesting(false); }
  };

  const retry = async (jobId: string) => {
    try {
      const updated = await FarmService.retryVegetationJob(jobId);
      setJobs((current) => current.map((job) => String(job.id) === String(updated.id) ? { ...job, ...updated } : job));
      setMessage('Satellite processing job queued again.');
    } catch (cause: any) { setError(cause.response?.data?.message || 'This job could not be retried.'); }
  };

  const latest = observations[0];
  return <section className="space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6" aria-labelledby="vegetation-heading">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Satellite className="h-5 w-5 text-primary" /><h2 id="vegetation-heading" className="text-xl font-bold text-text-primary">Vegetation monitoring</h2></div><p className="mt-1 max-w-2xl text-sm text-text-secondary">Parcel-level Sentinel-2 NDVI statistics. NDVI describes vegetation greenness and density; it does not diagnose disease, nutrient deficiency, yield, or water stress.</p></div>
      <div className="flex flex-wrap items-end gap-2">{eligible.length > 0 && <select value={parcelId} onChange={(event) => setParcelId(event.target.value)} aria-label="Select farm parcel" className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary">{eligible.map((parcel) => <option key={parcel.id} value={parcel.id}>{parcel.name}</option>)}</select>}
        {eligible.length > 0 && <><label className="text-xs text-text-secondary">From<input type="date" value={dateFrom} max={dateTo} onChange={(event) => setDateFrom(event.target.value)} className="mt-1 block rounded-lg border border-border bg-background px-2 py-2 text-sm text-text-primary" /></label><label className="text-xs text-text-secondary">To<input type="date" value={dateTo} min={dateFrom} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setDateTo(event.target.value)} className="mt-1 block rounded-lg border border-border bg-background px-2 py-2 text-sm text-text-primary" /></label></>}
        <button type="button" onClick={() => void request()} disabled={!parcelId || requesting || !configured || !dateFrom || !dateTo || dateFrom > dateTo} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${requesting ? 'animate-spin' : ''}`} />{requesting ? 'Queueing…' : 'Request imagery'}</button></div>
    </div>
    {!eligible.length && <p className="rounded-lg border border-border bg-surface/40 p-4 text-sm text-text-secondary">Save a farm boundary to request satellite monitoring. Approximate points alone cannot define a satellite analysis area.</p>}
    {eligible.length > 0 && !configured && <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-text-secondary">Sentinel Hub is not configured. Set provider credentials on the backend to enable real imagery; no sample measurements are shown.</p>}
    {error && <p role="alert" className="text-sm text-error">{error}</p>}{message && <p role="status" className="text-sm text-primary">{message}</p>}
    {latest && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-border bg-surface/40 p-4"><p className="text-xs text-text-secondary">Latest mean NDVI</p><p className="mt-1 text-2xl font-bold text-text-primary">{Number(latest.meanNdvi).toFixed(3)}</p><p className="mt-1 text-xs text-text-secondary">{category(Number(latest.meanNdvi))}</p></div>
      <div className="rounded-xl border border-border bg-surface/40 p-4"><p className="text-xs text-text-secondary">Observed</p><p className="mt-1 text-base font-semibold text-text-primary">{new Date(latest.acquisitionDate).toLocaleDateString()}</p><p className="mt-1 text-xs text-text-secondary">{latest.satellite}</p></div>
      <div className="rounded-xl border border-border bg-surface/40 p-4"><p className="text-xs text-text-secondary">NDVI range</p><p className="mt-1 text-base font-semibold text-text-primary">{Number(latest.minNdvi).toFixed(3)} to {Number(latest.maxNdvi).toFixed(3)}</p><p className="mt-1 text-xs text-text-secondary">Mean, minimum, maximum</p></div>
      <div className="rounded-xl border border-border bg-surface/40 p-4"><p className="text-xs text-text-secondary">Cloud / shadow pixels</p><p className="mt-1 text-2xl font-bold text-text-primary">{latest.cloudCoveragePercent == null ? '—' : `${Number(latest.cloudCoveragePercent).toFixed(1)}%`}</p><p className="mt-1 text-xs text-text-secondary">{Number(latest.validPixelCount).toLocaleString()} valid pixels</p></div>
    </div>}
    {!!observations.length && <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-surface/60 text-xs text-text-secondary"><tr><th className="p-3">Observation date</th><th className="p-3">Mean NDVI</th><th className="p-3">Range</th><th className="p-3">Cloud / shadow</th><th className="p-3">Source</th></tr></thead><tbody>{observations.map((item) => <tr key={item.id} className="border-t border-border"><td className="p-3 text-text-primary">{new Date(item.acquisitionDate).toLocaleDateString()}</td><td className="p-3 text-text-primary">{Number(item.meanNdvi).toFixed(3)}</td><td className="p-3 text-text-primary">{Number(item.minNdvi).toFixed(3)} – {Number(item.maxNdvi).toFixed(3)}</td><td className="p-3 text-text-primary">{item.cloudCoveragePercent == null ? '—' : `${Number(item.cloudCoveragePercent).toFixed(1)}%`}</td><td className="p-3 text-text-primary">{item.satellite}</td></tr>)}</tbody></table></div>}
    {observations.length > 1 && <div className="h-64 rounded-xl border border-border bg-surface/30 p-3"><p className="mb-2 text-sm font-semibold text-text-primary">Historical mean NDVI</p><ResponsiveContainer width="100%" height="90%"><LineChart data={[...observations].reverse().map((item) => ({ ...item, meanNdvi: Number(item.meanNdvi), date: new Date(item.acquisitionDate).toLocaleDateString() }))}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} /><YAxis domain={[-1, 1]} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} /><Tooltip /><Line type="monotone" dataKey="meanNdvi" name="Mean NDVI" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>}
    {!loading && parcelId && observations.length === 0 && <p className="flex items-center gap-2 rounded-lg border border-border bg-surface/40 p-3 text-sm text-text-secondary"><Activity className="h-4 w-4 shrink-0" />No usable observations recorded for this parcel yet. Missing imagery is not evidence of vegetation decline.</p>}
    {jobs.length > 0 && <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Recent processing</p><ul className="space-y-2 text-xs text-text-secondary">{jobs.slice(0, 5).map((job) => <li key={job.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-2"><span>{job.status.replaceAll('_', ' ')} · {String(job.dateFrom).slice(0, 10)} to {String(job.dateTo).slice(0, 10)}{job.errorMessage ? ` · ${job.errorMessage}` : ''}</span>{configured && ['failed', 'no_data', 'quality_insufficient', 'blocked_configuration'].includes(job.status) && <button type="button" onClick={() => void retry(String(job.id))} className="rounded border border-border px-2 py-1 font-semibold text-primary">Retry</button>}</li>)}</ul></div>}
    {!!observations.length && <p className="text-xs text-text-secondary">Interpretation bands are configurable screening rules, not universal crop-health standards. Crop, growth stage, season, soil background, canopy density, and residual cloud contamination affect NDVI. No disease alert is derived from NDVI alone.</p>}
  </section>;
}
