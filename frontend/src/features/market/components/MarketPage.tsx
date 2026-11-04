import { FormEvent, useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios';
import { PageHeader } from '@/components/common/PageHeader';
import { MarketPriceRecord, MarketQuery, MarketService } from '../services/MarketService';
import { Search, RefreshCw } from 'lucide-react';

const dateString = (date: Date) => date.toISOString().slice(0, 10);

export function MarketPage() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const [form, setForm] = useState<MarketQuery>({
    commodity: '', district: 'Bengaluru', state: 'Karnataka',
    startDate: dateString(thirtyDaysAgo), endDate: dateString(today), limit: 200,
  });
  const [records, setRecords] = useState<MarketPriceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchPrices = async (queryPayload: MarketQuery) => {
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const result = await MarketService.getPrices(queryPayload);
      setRecords(result);
    } catch (err: any) {
      setRecords([]);
      setError(err.response?.data?.message || 'Market records could not be loaded. Check the connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let initialQuery = { ...form };
    apiClient.get('/farmer-profile/me').then(({ data }) => {
      const profile = data?.data;
      if ((profile?.district && profile.district !== 'Default') || (profile?.state && profile.state !== 'Default')) {
        const updated = {
          ...initialQuery,
          district: profile.district && profile.district !== 'Default' ? profile.district : initialQuery.district,
          state: profile.state && profile.state !== 'Default' ? profile.state : initialQuery.state,
        };
        setForm(updated);
        fetchPrices(updated);
        return;
      }
      fetchPrices(initialQuery);
    }).catch(() => {
      fetchPrices(initialQuery);
    });
  }, []);

  const runQuery = async (event?: FormEvent) => {
    event?.preventDefault();
    fetchPrices(form);
  };

  const setField = (key: keyof MarketQuery, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return <div className="space-y-6 pb-16">
    <PageHeader title="Market Intelligence" description="Browse recorded market prices by commodity, market and region. Results show source observations only." />
    <form onSubmit={runQuery} className="glass rounded-xl border border-border p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <label className="text-xs text-text-secondary">Commodity
        <input value={form.commodity || ''} onChange={(e) => setField('commodity', e.target.value)} placeholder="All commodities or e.g. Tomato" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" />
      </label>
      <label className="text-xs text-text-secondary">District
        <input value={form.district || ''} onChange={(e) => setField('district', e.target.value)} placeholder="Bengaluru" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" />
      </label>
      <label className="text-xs text-text-secondary">State
        <input value={form.state || ''} onChange={(e) => setField('state', e.target.value)} placeholder="Karnataka" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" />
      </label>
      <label className="text-xs text-text-secondary">Market / APMC (optional)
        <input value={form.market || ''} onChange={(e) => setField('market', e.target.value)} placeholder="Market name" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" />
      </label>
      <label className="text-xs text-text-secondary">From
        <input type="date" value={form.startDate || ''} onChange={(e) => setField('startDate', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" />
      </label>
      <label className="text-xs text-text-secondary">To
        <input type="date" value={form.endDate || ''} onChange={(e) => setField('endDate', e.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" />
      </label>
      <div className="lg:col-span-2 flex items-end">
        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60">
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? 'Loading observations…' : 'Search recorded prices'}
        </button>
      </div>
    </form>

    {error && <div role="alert" className="rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</div>}
    {searched && !loading && !error && records.length === 0 && <div className="glass rounded-xl border border-border p-8 text-center">
      <h2 className="font-bold text-text-primary">No recorded prices found</h2>
      <p className="mt-2 text-sm text-text-secondary">Try a wider date range or another market. No substitute prices are shown when records are missing.</p>
    </div>}
    {records.length > 0 && <section className="glass overflow-hidden rounded-xl border border-border">
      <div className="border-b border-border p-4">
        <h2 className="font-bold text-text-primary">Recorded observations</h2>
        <p className="mt-1 text-xs text-text-secondary">{records.length} records · values are market observations, not forecasts. Search location applies to this query only.</p>
      </div>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <thead className="bg-surface/70 text-xs text-text-secondary"><tr>
          {['Date', 'Commodity', 'Market', 'District / State', 'Min', 'Modal', 'Max', 'Source', 'Updated'].map((head) => <th key={head} className="whitespace-nowrap px-4 py-3 font-semibold">{head}</th>)}
        </tr></thead>
        <tbody>{records.map((record) => <tr key={record._id} className="border-t border-border/70 text-text-primary">
          <td className="whitespace-nowrap px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
          <td className="px-4 py-3">{record.commodity}</td><td className="px-4 py-3">{record.market}</td>
          <td className="whitespace-nowrap px-4 py-3">{[record.district, record.state].filter(Boolean).join(', ')}</td>
          {[record.minPrice, record.modalPrice, record.maxPrice].map((price, i) => <td key={i} className="whitespace-nowrap px-4 py-3">₹{Number(price).toLocaleString('en-IN')} / {record.unit}</td>)}
          <td className="px-4 py-3">{record.source || 'Unspecified'}</td>
          <td className="whitespace-nowrap px-4 py-3">{record.normalizedAt || record.updatedAt ? new Date(record.normalizedAt || record.updatedAt!).toLocaleString() : 'Not recorded'}</td>
        </tr>)}</tbody>
      </table></div>
    </section>}
  </div>;
}
