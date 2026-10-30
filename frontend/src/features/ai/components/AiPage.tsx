import { FormEvent, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { apiClient } from '@/lib/axios';
import { Search, Loader2, ChevronDown } from 'lucide-react';

interface DecisionResult {
  traceId: string; status: string; intent?: string; commodity?: string; answer: string;
  dateRange?: { startDate: string; endDate: string };
  comparisons?: Array<{ location: string; recordCount: number; markets: string[]; firstObserved: any; lastObserved: any; observedChangePercent: number | null; observedMinimum: number | null; observedMaximum: number | null }>;
  evidence?: Array<{ location: string; records: any[] }>;
  stages: Array<{ name: string; status: string; timestamp: string; inputs?: unknown; outputs?: unknown; dataSources?: string[]; ruleVersions?: string[] }>;
  limitations: string[];
}

export function AiPage() {
  const [query, setQuery] = useState('Analyze tomato prices in Bengaluru over the last 30 days');
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError(''); setResult(null);
    try { const { data } = await apiClient.post('/decision-center/query', { query }); setResult(data); }
    catch (err: any) { setError(err.response?.data?.message || 'The analysis could not be completed.'); }
    finally { setLoading(false); }
  };

  return <div className="space-y-6 pb-16">
    <PageHeader title="AI Decision Center" description="Ask a question. The current analysis flow uses stored market observations and deterministic calculations; it does not invent missing evidence." />
    <form onSubmit={submit} className="glass rounded-xl border border-border p-5">
      <label htmlFor="decision-question" className="mb-2 block text-sm font-semibold text-text-primary">What would you like to understand?</label>
      <textarea id="decision-question" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={500} rows={3} className="w-full rounded-lg border border-border bg-background p-3 text-sm text-text-primary" placeholder="e.g. Compare tomato prices between Bengaluru and Mysuru over the last 30 days" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-text-secondary">Market questions supported: commodity prices, observed trends and Bengaluru/Mysuru comparisons.</p>
        <button disabled={loading || query.trim().length < 3} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{loading ? 'Analyzing records…' : 'Analyze'}
        </button>
      </div>
    </form>
    {error && <div role="alert" className="rounded-lg border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</div>}
    {result && <div className="space-y-5">
      <section className="glass rounded-xl border border-border p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-text-secondary">{result.status.replaceAll('_', ' ')}</p><h2 className="mt-2 text-lg font-bold text-text-primary">Explain in simple language</h2></div><span className="text-xs text-text-secondary">Trace {result.traceId}</span></div>
        <p className="mt-3 leading-relaxed text-text-primary">{result.answer}</p>
        {result.dateRange && <p className="mt-3 text-xs text-text-secondary">Period {new Date(result.dateRange.startDate).toLocaleDateString()} – {new Date(result.dateRange.endDate).toLocaleDateString()}</p>}
        {result.limitations.length > 0 && <div className="mt-4 rounded-lg bg-surface/60 p-3"><h3 className="text-xs font-bold text-text-secondary">Limitations</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-text-secondary">{result.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>}
      </section>
      {!!result.comparisons?.length && <section className="glass overflow-hidden rounded-xl border border-border"><div className="border-b border-border p-4"><h2 className="font-bold text-text-primary">Recorded price analysis</h2><p className="mt-1 text-xs text-text-secondary">Observed values only; no forecast or sell/hold advice.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-xs text-text-secondary"><tr>{['Region','Records','Markets','First modal','Latest modal','Observed change','Range min–max'].map((item)=><th key={item} className="px-4 py-3">{item}</th>)}</tr></thead><tbody>{result.comparisons.map((item)=><tr key={item.location} className="border-t border-border"><td className="px-4 py-3 text-text-primary">{item.location}</td><td className="px-4 py-3 text-text-primary">{item.recordCount}</td><td className="px-4 py-3 text-text-primary">{item.markets.join(', ') || '—'}</td><td className="px-4 py-3 text-text-primary">{item.firstObserved ? `₹${Number(item.firstObserved.modalPrice).toLocaleString('en-IN')} / ${item.firstObserved.unit}` : '—'}</td><td className="px-4 py-3 text-text-primary">{item.lastObserved ? `₹${Number(item.lastObserved.modalPrice).toLocaleString('en-IN')} / ${item.lastObserved.unit}` : '—'}</td><td className="px-4 py-3 text-text-primary">{item.observedChangePercent === null ? 'Insufficient records' : `${item.observedChangePercent > 0 ? '+' : ''}${item.observedChangePercent}%`}</td><td className="px-4 py-3 text-text-primary">{item.observedMinimum === null ? '—' : `₹${item.observedMinimum}–₹${item.observedMaximum}`}</td></tr>)}</tbody></table></div></section>}
      {!!result.evidence?.length && <details className="glass rounded-xl border border-border p-4"><summary className="flex cursor-pointer list-none items-center gap-2 font-bold text-text-primary"><ChevronDown className="h-4 w-4" />Collected evidence</summary><div className="mt-4 space-y-4">{result.evidence.map((group) => <div key={group.location}><h3 className="mb-2 text-sm font-semibold text-text-primary">{group.location} ({group.records.length})</h3><div className="max-h-72 overflow-auto rounded-lg bg-background/70 p-3 text-xs text-text-secondary">{group.records.map((row, index) => <p key={`${row.market}-${row.date}-${index}`} className="border-b border-border/50 py-2">{new Date(row.date).toLocaleDateString()} · {row.commodity} · {row.market} · modal ₹{Number(row.modalPrice).toLocaleString('en-IN')} / {row.unit} · {row.source}</p>)}</div></div>)}</div></details>}
      <section className="glass rounded-xl border border-border p-4"><h2 className="mb-3 font-bold text-text-primary">Decision pipeline</h2><div className="space-y-2">{result.stages.map((stage) => <details key={stage.name} className="rounded-lg border border-border/70 bg-surface/30 p-3"><summary className="cursor-pointer text-sm font-semibold capitalize text-text-primary">{stage.name.replaceAll('_', ' ')} <span className="ml-2 text-xs font-normal text-text-secondary">{stage.status} · {new Date(stage.timestamp).toLocaleTimeString()}</span></summary><div className="mt-3 grid gap-3 text-xs text-text-secondary md:grid-cols-2"><div><b>Inputs</b><pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(stage.inputs ?? {}, null, 2)}</pre></div><div><b>Outputs</b><pre className="mt-1 whitespace-pre-wrap">{JSON.stringify(stage.outputs ?? {}, null, 2)}</pre></div></div>{stage.dataSources?.length ? <p className="mt-2 text-xs text-text-secondary">Sources: {stage.dataSources.join(', ')}</p> : null}</details>)}</div></section>
    </div>}
  </div>;
}
