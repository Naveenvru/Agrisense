import { FormEvent, useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { apiClient } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, RefreshCw } from 'lucide-react';

interface ReportRecord { id: string; reportType: string; reportTitle: string; periodStart: string; periodEnd: string; metadata: { rowCount: number; sources: string[] }; createdAt: string }
const types = [
  ['farm_performance', 'Farm Performance'], ['market_intelligence', 'Market Intelligence'], ['weather', 'Weather'], ['crop_activity', 'Crop Activity'], ['ai_analysis', 'AI Analysis'],
];

export function ReportsPage() {
  const now = new Date(); const monthAgo = new Date(now); monthAgo.setDate(now.getDate() - 30);
  const [reportType, setReportType] = useState('farm_performance');
  const [startDate, setStartDate] = useState(monthAgo.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(now.toISOString().slice(0, 10));
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const loadHistory = async () => { try { const { data } = await apiClient.get('/reports'); setReports(data); } catch (err: any) { setError(err.response?.data?.message || 'Report history could not be loaded.'); } };
  useEffect(() => { void loadHistory(); }, []);
  const generate = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await apiClient.post('/reports', { reportType, startDate, endDate }); await loadHistory(); }
    catch (err: any) { setError(err.response?.data?.message || 'No report could be generated from the available records.'); }
    finally { setLoading(false); }
  };
  const download = async (id: string) => {
    setDownloading(id); setError('');
    try {
      const response = await apiClient.get(`/reports/${id}/download`, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `agrisense-report-${id}.pdf`; anchor.click(); URL.revokeObjectURL(url);
    } catch (err: any) { setError(err.response?.data?.message || 'The report PDF could not be downloaded.'); }
    finally { setDownloading(null); }
  };

  return <div className="space-y-6">
    <PageHeader title="Reports" description="Generate reports from your recorded farm, market, weather, crop activity and decision records." action={<Button variant="outline" onClick={() => void loadHistory()} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>} />
    {error && <div role="alert" className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</div>}
    <form onSubmit={generate} className="glass grid grid-cols-1 items-end gap-4 rounded-xl border border-border p-5 md:grid-cols-4">
      <label className="text-xs text-text-secondary">Report type<select value={reportType} onChange={(e) => setReportType(e.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary">{types.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="text-xs text-text-secondary">From<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label>
      <label className="text-xs text-text-secondary">To<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label>
      <Button type="submit" disabled={loading} className="gap-2"><FileText className="h-4 w-4" />{loading ? 'Generating…' : 'Generate from records'}</Button>
    </form>
    <div className="space-y-3">{reports.length === 0 ? <div className="glass rounded-xl border border-border p-8 text-center"><FileText className="mx-auto mb-3 h-8 w-8 text-text-secondary" /><h2 className="font-bold text-text-primary">No generated reports</h2><p className="mt-2 text-sm text-text-secondary">Reports are added here only after a successful generation from actual records.</p></div> : reports.map((report) => <Card key={report.id} className="glass"><CardContent className="flex items-center justify-between gap-4 p-4"><div><h3 className="font-semibold text-text-primary">{report.reportTitle}</h3><div className="mt-1 text-xs text-text-secondary">{report.periodStart} – {report.periodEnd} · {report.metadata.rowCount} records · {new Date(report.createdAt).toLocaleString()}</div><div className="mt-1 text-xs text-text-secondary">Sources: {report.metadata.sources.join(', ')}</div></div><Button variant="ghost" size="icon" aria-label="Download report PDF" disabled={downloading === report.id} onClick={() => void download(report.id)}><Download className="h-5 w-5 text-text-secondary" /></Button></CardContent></Card>)}</div>
  </div>;
}
