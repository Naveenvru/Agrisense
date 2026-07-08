import { Injectable } from '@nestjs/common';
import { DemandMongoService } from '../../mongodb/demand/demand-mongo.service';
import type { DemandAnalyticsSnapshot } from '../interfaces/demand-intelligence.types';
import { average, round } from '../../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class DemandAnalyticsService {
  constructor(private readonly demandMongoService: DemandMongoService) {}

  async refreshGlobalAnalytics(): Promise<DemandAnalyticsSnapshot> {
    const predictions = await this.demandMongoService.findAllPredictions();
    const snapshot = this.buildSnapshot(predictions as any[], 'global', undefined, undefined);
    await this.demandMongoService.upsertAnalytics('global', 'monthly', snapshot.periodStart, snapshot as any);
    return snapshot;
  }

  async refreshRegionalAnalytics(): Promise<void> {
    const predictions = await this.demandMongoService.findAllPredictions();
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
      await this.demandMongoService.upsertAnalytics('regional', 'monthly', periodStart, snapshot as any);
    }
  }

  async getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit = 12): Promise<any[]> {
    return this.demandMongoService.findAnalytics(regionLevel, regionName, periodType, limit);
  }

  private buildSnapshot(
    predictions: any[],
    scope: 'global' | 'regional' | 'crop',
    regionLevel?: 'village' | 'taluk' | 'district' | 'state',
    regionName?: string,
    cropName?: string,
  ): DemandAnalyticsSnapshot {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const cropWiseDemand: Record<string, number> = {};
    const regionWiseDemand: Record<string, number> = {};
    const weeklyDemand: Record<string, number> = {};
    const monthlyDemand: Record<string, number> = {};
    const seasonalDemand: Record<string, number> = {};
    const trendMap = new Map<string, number>();
    const cropSamples: Array<{ cropName: string; demandKg: number }> = [];
    const regionGroups = new Map<string, { total: number; count: number; confidence: number; regionLevel: string; regionName: string }>();

    for (const item of predictions) {
      const crop = item.cropName ?? 'Unknown';
      const demandKg = item.currentDemandKg ?? 0;
      cropWiseDemand[crop] = (cropWiseDemand[crop] ?? 0) + demandKg;
      cropSamples.push({ cropName: crop, demandKg });

      const regionKey = `${item.regionLevel ?? 'district'}:${item.regionName ?? 'unknown'}`;
      regionWiseDemand[regionKey] = (regionWiseDemand[regionKey] ?? 0) + demandKg;

      const monthKey = new Date(item.assessedAt ?? now).toISOString().slice(0, 7);
      monthlyDemand[monthKey] = (monthlyDemand[monthKey] ?? 0) + demandKg;
      trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + demandKg);

      const weekKey = `w${Math.ceil(new Date(item.assessedAt ?? now).getDate() / 7)}`;
      weeklyDemand[weekKey] = (weeklyDemand[weekKey] ?? 0) + demandKg;

      const seasonKey = String(item.cropCategory ?? 'unspecified');
      seasonalDemand[seasonKey] = (seasonalDemand[seasonKey] ?? 0) + demandKg;

      const existing = regionGroups.get(regionKey) ?? { total: 0, count: 0, confidence: 0, regionLevel: item.regionLevel ?? 'district', regionName: item.regionName ?? 'unknown' };
      existing.total += demandKg;
      existing.count += 1;
      existing.confidence += item.confidence ?? 0;
      regionGroups.set(regionKey, existing);
    }

    const topDemandRegions = Array.from(regionGroups.values())
      .map((entry) => ({
        regionLevel: entry.regionLevel,
        regionName: entry.regionName,
        demandKg: round(entry.total, 0),
        confidence: entry.count ? round(entry.confidence / entry.count, 0) : 0,
      }))
      .sort((a, b) => b.demandKg - a.demandKg)
      .slice(0, 5);

    const cropTotals = new Map<string, number>();
    for (const sample of cropSamples) {
      cropTotals.set(sample.cropName, (cropTotals.get(sample.cropName) ?? 0) + sample.demandKg);
    }

    const totalDemandKg = predictions.reduce((sum, item) => sum + (item.currentDemandKg ?? 0), 0);
    const cropDistribution = Array.from(cropTotals.entries())
      .map(([name, demandKg]) => ({ cropName: name, demandKg: round(demandKg, 0), sharePercent: totalDemandKg > 0 ? round((demandKg / totalDemandKg) * 100, 2) : 0 }))
      .sort((a, b) => b.demandKg - a.demandKg)
      .slice(0, 10);

    const demandTrend = Array.from(trendMap.entries())
      .map(([period, demandKg]) => ({ period, demandKg: round(demandKg, 0) }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const averageDemandKg = predictions.length
      ? round(average(predictions.map((item) => item.currentDemandKg ?? 0)), 0)
      : 0;

    return {
      scope,
      regionLevel,
      regionName,
      cropName,
      periodType: 'monthly',
      periodStart,
      periodEnd,
      cropWiseDemand,
      regionWiseDemand,
      weeklyDemand,
      monthlyDemand,
      seasonalDemand,
      averageDemandKg,
      demandTrend,
      topDemandRegions,
      cropDistribution,
      generatedAt: now,
    };
  }
}
