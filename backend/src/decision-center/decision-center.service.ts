import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { MarketService } from '../market/market.service';
import { DecisionTrace } from './decision-trace.entity';

const DISTRICTS: Record<string, string> = { bengaluru: 'Bengaluru Urban', mysuru: 'Mysuru', mysore: 'Mysuru' };

@Injectable()
export class DecisionCenterService {
  constructor(
    @InjectRepository(DecisionTrace) private readonly traces: Repository<DecisionTrace>,
    private readonly market: MarketService,
  ) {}

  async analyze(userId: string, query: string) {
    const traceId = randomUUID();
    const startedAt = new Date();
    const parsed = this.parseQuery(query, startedAt);
    if (!parsed) {
      return this.saveTrace(userId, traceId, query, 'unsupported', {
        status: 'unsupported',
        answer: 'This Decision Center currently analyzes recorded market prices. Ask about a commodity price or historical market movement, and include a location when you want a specific region.',
        traceId,
        stages: [{ name: 'intent_and_context', status: 'unsupported', timestamp: startedAt, inputs: { query }, outputs: { supportedIntent: 'market_price_analysis' }, dataSources: [] }],
        limitations: ['Weather, crop health and disease queries are not connected to this analysis flow yet.'],
      });
    }

    const stages: any[] = [{ name: 'intent_and_context', status: 'completed', timestamp: new Date(), inputs: { query }, outputs: parsed, dataSources: [] }];
    const evidence: any[] = [];
    for (const location of parsed.locations) {
      let records;
      try {
        records = await this.market.getPricesForUser(userId, {
          commodity: parsed.commodity,
          district: location.district,
          state: location.state,
          startDate: parsed.startDate,
          endDate: parsed.endDate,
          limit: 500,
        });
      } catch {
        const failedAt = new Date();
        stages.push({ name: 'evidence_collection', status: 'failed', timestamp: failedAt, inputs: { commodity: parsed.commodity, location: location.label }, outputs: { error: 'Market records unavailable' }, dataSources: ['MongoDB market_prices_v2'] });
        stages.push({ name: 'data_validation', status: 'skipped', timestamp: new Date(), inputs: {}, outputs: { reason: 'Evidence collection failed' }, dataSources: [] });
        stages.push({ name: 'deterministic_analysis', status: 'skipped', timestamp: new Date(), inputs: {}, outputs: { reason: 'No evidence was collected' }, dataSources: [], ruleVersions: [] });
        return this.saveTrace(userId, traceId, query, 'failed', {
          traceId, status: 'failed', answer: 'Market records could not be retrieved, so no analysis was produced.', stages,
          limitations: ['The market data store or query service was unavailable. Try again later.'], generatedAt: new Date(),
        });
      }
      const validCandidates = records.filter((record) =>
        record.commodity && record.market && record.source &&
        Number.isFinite(Number(record.modalPrice)) && Number.isFinite(Number(record.minPrice)) && Number.isFinite(Number(record.maxPrice)) &&
        Number(record.minPrice) >= 0 && Number(record.modalPrice) >= Number(record.minPrice) && Number(record.maxPrice) >= Number(record.modalPrice) &&
        new Date(record.date) >= parsed.startDate && new Date(record.date) <= parsed.endDate,
      );
      const unique = new Map<string, typeof validCandidates[number]>();
      for (const record of validCandidates) {
        const key = `${record.commodity.toLowerCase()}|${record.market.toLowerCase()}|${new Date(record.date).toISOString().slice(0, 10)}`;
        const existing = unique.get(key);
        const recordFreshness = new Date((record as any).normalizedAt || (record as any).updatedAt || 0).getTime();
        const existingFreshness = existing ? new Date((existing as any).normalizedAt || (existing as any).updatedAt || 0).getTime() : -1;
        if (!existing || recordFreshness > existingFreshness) unique.set(key, record);
      }
      const valid = [...unique.values()];
      evidence.push({
        location: location.label,
        records: valid.map((row) => ({ commodity: row.commodity, market: row.market, district: row.district, state: row.state, date: row.date, minPrice: row.minPrice, modalPrice: row.modalPrice, maxPrice: row.maxPrice, unit: row.unit, source: row.source, updatedAt: row.normalizedAt || (row as any).updatedAt })),
        validationCounts: { rejected: records.length - validCandidates.length, duplicates: validCandidates.length - valid.length },
      });
    }
    stages.push({ name: 'evidence_collection', status: 'completed', timestamp: new Date(), inputs: { commodity: parsed.commodity, locations: parsed.locations, dateRange: [parsed.startDate, parsed.endDate] }, outputs: { recordCount: evidence.reduce((count, item) => count + item.records.length, 0) }, dataSources: ['MongoDB market_prices_v2'] });
    const totalRecords = evidence.reduce((count, item) => count + item.records.length, 0);
    stages.push({ name: 'data_validation', status: totalRecords ? 'completed' : 'insufficient_evidence', timestamp: new Date(), inputs: { fetchedRecordCount: evidence.reduce((count, item) => count + item.records.length + item.validationCounts.rejected + item.validationCounts.duplicates, 0) }, outputs: { validRecordCount: totalRecords, rejectedRecordCount: evidence.reduce((count, item) => count + item.validationCounts.rejected, 0), duplicateRecordCount: evidence.reduce((count, item) => count + item.validationCounts.duplicates, 0), validation: totalRecords ? 'finite non-negative prices ordered min <= modal <= max, valid date range and source; duplicate day/market/commodity records removed' : 'no matching valid records' }, dataSources: [] });

    const comparisons = evidence.map((group) => this.summarize(group));
    stages.push({ name: 'deterministic_analysis', status: totalRecords ? 'completed' : 'insufficient_evidence', timestamp: new Date(), inputs: { perLocationRecords: comparisons.map((item) => ({ location: item.location, count: item.recordCount })) }, outputs: { comparisons }, dataSources: ['MongoDB market_prices_v2'], ruleVersions: [] });
    const result = {
      traceId,
      status: totalRecords ? 'completed' : 'insufficient_evidence',
      intent: parsed.locations.length > 1 ? 'market_comparison' : 'market_history',
      commodity: parsed.commodity,
      dateRange: { startDate: parsed.startDate, endDate: parsed.endDate },
      answer: totalRecords ? this.explain(parsed.commodity, comparisons) : `No recorded ${parsed.commodity} prices were found for the requested region and period. No prices or trend have been inferred.`,
      comparisons,
      evidence,
      stages,
      limitations: totalRecords ? ['This describes stored market observations and is not a future price prediction or a sell/hold recommendation.'] : ['Market data may be missing, delayed, or unavailable for this region.'],
      generatedAt: new Date(),
    };
    return this.saveTrace(userId, traceId, query, result.status as any, result);
  }

  async history(userId: string) { return this.traces.find({ where: { userId }, order: { createdAt: 'DESC' }, take: 50 }).then((rows) => rows.map(({ traceId, query, status, createdAt, result }) => ({ traceId, query, status, createdAt, summary: result['answer'] }))); }
  async getTrace(userId: string, traceId: string) { return this.traces.findOne({ where: { userId, traceId } }); }

  private async saveTrace(userId: string, traceId: string, query: string, status: DecisionTrace['status'], result: Record<string, unknown>) {
    await this.traces.save(this.traces.create({ userId, traceId, query, status, result }));
    return result;
  }

  private parseQuery(query: string, now: Date) {
    const normalized = query.toLowerCase();
    const commodityMatch = normalized.match(/([a-z][a-z -]{1,40}?)\s+prices?/i);
    if (!commodityMatch || !/(price|market|sell|compare|trend)/i.test(normalized)) return null;
    const commodity = commodityMatch[1].trim().replace(/^(analyze|analyse|compare|show|check)\s+/, '');
    if (!commodity || commodity.length > 40) return null;
    const locationKeys = Object.keys(DISTRICTS).filter((city) => normalized.includes(city));
    const locations = [...new Set(locationKeys.map((key) => DISTRICTS[key]))].map((district) => ({ district, state: 'Karnataka', label: district }));
    const days = Number(normalized.match(/last\s+(\d{1,3})\s+days?/)?.[1] || 30);
    const endDate = new Date(now); endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(now); startDate.setDate(startDate.getDate() - Math.min(365, Math.max(1, days))); startDate.setHours(0, 0, 0, 0);
    return { commodity, locations: locations.length ? locations : [{ district: undefined, state: undefined, label: 'saved farm region' }], startDate, endDate };
  }

  private summarize(group: { location: string; records: any[] }) {
    const sorted = [...group.records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0]; const last = sorted.at(-1);
    const change = first && last && first.modalPrice !== 0 ? ((last.modalPrice - first.modalPrice) / first.modalPrice) * 100 : null;
    return { location: group.location, recordCount: sorted.length, markets: [...new Set(sorted.map((row) => row.market))], firstObserved: first ? { date: first.date, modalPrice: first.modalPrice, unit: first.unit } : null, lastObserved: last ? { date: last.date, modalPrice: last.modalPrice, unit: last.unit } : null, observedChangePercent: change === null ? null : Number(change.toFixed(2)), observedMinimum: sorted.length ? Math.min(...sorted.map((r) => Number(r.minPrice))) : null, observedMaximum: sorted.length ? Math.max(...sorted.map((r) => Number(r.maxPrice))) : null };
  }

  private explain(commodity: string, comparisons: any[]) {
    return comparisons.map((item) => item.recordCount < 1 ? `No recorded ${commodity} prices were found for ${item.location}.` : item.observedChangePercent === null ? `${item.recordCount} recorded ${commodity} price observation(s) are available for ${item.location}; there is not enough information to calculate a change.` : `In ${item.location}, the recorded modal price for ${commodity} changed ${item.observedChangePercent >= 0 ? 'by +' : 'by '}${item.observedChangePercent}% between the first and latest observations in this period (${item.recordCount} records).`).join(' ');
  }
}
