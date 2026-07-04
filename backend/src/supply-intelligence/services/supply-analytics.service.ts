import { Injectable } from '@nestjs/common';
import { SupplyMongoService } from '../../mongodb/supply/supply-mongo.service';
import type { SupplyAnalyticsSnapshot } from '../interfaces/supply-intelligence.types';
import { average, round } from '../../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class SupplyAnalyticsService {
  constructor(private readonly supplyMongoService: SupplyMongoService) {}

  async refreshGlobalAnalytics(): Promise<SupplyAnalyticsSnapshot> {
    const predictions = await this.supplyMongoService.findAllPredictions();
    const snapshot = this.buildSnapshot(predictions as any[], 'global', undefined, undefined);
    await this.supplyMongoService.upsertAnalytics('global', 'monthly', snapshot.periodStart, snapshot as any);
    return snapshot;
  }

  async refreshRegionalAnalytics(): Promise<void> {
    const predictions = await this.supplyMongoService.findAllPredictions();
    const groups = new Map<string, any[]>();

    for (const item of predictions as any[]) {
      const key = `${item.regionLevel ?? 'district'}|${item.regionName ?? 'unknown'}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }

    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    for (const [key, items] of groups.entries()) {
      const [regionLevel, regionName] = key.split('|');
      const snapshot = this.buildSnapshot(items, 'regional', regionLevel as any, regionName);
      await this.supplyMongoService.upsertAnalytics('regional', 'monthly', periodStart, snapshot as any);
    }
  }

  async getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit = 12): Promise<any[]> {
    return this.supplyMongoService.findAnalytics(regionLevel, regionName, periodType, limit);
  }

  private buildSnapshot(
    predictions: any[],
    scope: 'global' | 'regional' | 'crop',
    regionLevel?: 'village' | 'taluk' | 'district' | 'state',
    regionName?: string,
    cropName?: string,
  ): SupplyAnalyticsSnapshot {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const cropWiseSupply: Record<string, number> = {};
    const regionWiseSupply: Record<string, number> = {};
    const weeklySupply: Record<string, number> = {};
    const monthlySupply: Record<string, number> = {};
    const seasonalSupply: Record<string, number> = {};
    const trendMap = new Map<string, number>();
    const cropSamples: Array<{ cropName: string; supplyKg: number }> = [];
    const regionGroups = new Map<string, { total: number; count: number; confidence: number; regionLevel: string; regionName: string }>();

    for (const item of predictions) {
      const crop = item.cropName ?? 'Unknown';
      const supplyKg = item.availableSupplyKg ?? 0;
      cropWiseSupply[crop] = (cropWiseSupply[crop] ?? 0) + supplyKg;
      cropSamples.push({ cropName: crop, supplyKg });

      const regionKey = `${item.regionLevel ?? 'district'}:${item.regionName ?? 'unknown'}`;
      regionWiseSupply[regionKey] = (regionWiseSupply[regionKey] ?? 0) + supplyKg;

      const monthKey = new Date(item.assessedAt ?? now).toISOString().slice(0, 7);
      monthlySupply[monthKey] = (monthlySupply[monthKey] ?? 0) + supplyKg;
      trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + supplyKg);

      const weekKey = `w${Math.ceil(new Date(item.assessedAt ?? now).getDate() / 7)}`;
      weeklySupply[weekKey] = (weeklySupply[weekKey] ?? 0) + supplyKg;

      const seasonKey = String(item.cropCategory ?? 'unspecified');
      seasonalSupply[seasonKey] = (seasonalSupply[seasonKey] ?? 0) + supplyKg;

      const existing = regionGroups.get(regionKey) ?? { total: 0, count: 0, confidence: 0, regionLevel: item.regionLevel ?? 'district', regionName: item.regionName ?? 'unknown' };
      existing.total += supplyKg;
      existing.count += 1;
      existing.confidence += item.confidence ?? 0;
      regionGroups.set(regionKey, existing);
    }

    const topProducingRegions = Array.from(regionGroups.values())
      .map((entry) => ({
        regionLevel: entry.regionLevel,
        regionName: entry.regionName,
        supplyKg: round(entry.total, 0),
        confidence: entry.count ? round(entry.confidence / entry.count, 0) : 0,
      }))
      .sort((a, b) => b.supplyKg - a.supplyKg)
      .slice(0, 5);

    const cropTotals = new Map<string, number>();
    for (const sample of cropSamples) {
      cropTotals.set(sample.cropName, (cropTotals.get(sample.cropName) ?? 0) + sample.supplyKg);
    }

    const totalSupplyKg = predictions.reduce((sum, item) => sum + (item.availableSupplyKg ?? 0), 0);
    const cropDistribution = Array.from(cropTotals.entries())
      .map(([name, supplyKg]) => ({ cropName: name, supplyKg: round(supplyKg, 0), sharePercent: totalSupplyKg > 0 ? round((supplyKg / totalSupplyKg) * 100, 2) : 0 }))
      .sort((a, b) => b.supplyKg - a.supplyKg)
      .slice(0, 10);

    const supplyTrend = Array.from(trendMap.entries())
      .map(([period, supplyKg]) => ({ period, supplyKg: round(supplyKg, 0) }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const averageSupplyKg = predictions.length ? round(average(predictions.map((item) => item.availableSupplyKg ?? 0)), 0) : 0;

    return {
      scope,
      regionLevel,
      regionName,
      cropName,
      periodType: 'monthly',
      periodStart,
      periodEnd,
      cropWiseSupply,
      regionWiseSupply,
      weeklySupply,
      monthlySupply,
      seasonalSupply,
      averageSupplyKg,
      supplyTrend,
      topProducingRegions,
      cropDistribution,
      generatedAt: now,
    };
  }
}