import { Injectable } from '@nestjs/common';
import { YieldMongoService } from '../../mongodb/yield/yield-mongo.service';
import type { YieldAnalyticsSnapshot } from '../interfaces/yield-intelligence.types';
import { average, round } from '../utils/yield-rule.utils';

@Injectable()
export class YieldAnalyticsService {
  constructor(private readonly yieldMongoService: YieldMongoService) {}

  async refreshGlobalAnalytics(): Promise<YieldAnalyticsSnapshot> {
    const predictions = await this.yieldMongoService.findAllPredictions();
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const cropWiseYield: Record<string, number> = {};
    const regionWiseYield: Record<string, number> = {};
    const monthlyYield: Record<string, number> = {};
    const seasonWiseYield: Record<string, number> = {};
    const trendMap = new Map<string, number>();

    const avgSamples: Array<{ cropName: string; yieldKg: number; confidence: number }> = [];

    for (const item of predictions as any[]) {
      const crop = item.cropName ?? 'Unknown';
      cropWiseYield[crop] = (cropWiseYield[crop] ?? 0) + (item.expectedYieldKg ?? 0);

      const regionKey = item.farmerProfileId ? `profile:${item.farmerProfileId}` : 'unknown';
      regionWiseYield[regionKey] = (regionWiseYield[regionKey] ?? 0) + (item.expectedYieldKg ?? 0);

      const monthKey = new Date(item.assessedAt ?? now).toISOString().slice(0, 7);
      monthlyYield[monthKey] = (monthlyYield[monthKey] ?? 0) + (item.expectedYieldKg ?? 0);
      trendMap.set(monthKey, (trendMap.get(monthKey) ?? 0) + (item.expectedYieldKg ?? 0));

      const seasonKey = item.lifecycle?.season ?? item.cropCategory ?? 'unspecified';
      seasonWiseYield[String(seasonKey)] = (seasonWiseYield[String(seasonKey)] ?? 0) + (item.expectedYieldKg ?? 0);

      avgSamples.push({ cropName: crop, yieldKg: item.expectedYieldKg ?? 0, confidence: item.confidence ?? 0 });
    }

    const groupedTop = new Map<string, { total: number; count: number; confidence: number }>();
    for (const sample of avgSamples) {
      const entry = groupedTop.get(sample.cropName) ?? { total: 0, count: 0, confidence: 0 };
      entry.total += sample.yieldKg;
      entry.count += 1;
      entry.confidence += sample.confidence;
      groupedTop.set(sample.cropName, entry);
    }

    const topPerformingCrops = Array.from(groupedTop.entries())
      .map(([cropName, entry]) => ({
        cropName,
        averageYieldKg: entry.count ? round(entry.total / entry.count, 0) : 0,
        confidence: entry.count ? round(entry.confidence / entry.count, 0) : 0,
      }))
      .sort((a, b) => b.averageYieldKg - a.averageYieldKg)
      .slice(0, 5);

    const yieldTrend = Array.from(trendMap.entries())
      .map(([period, yieldKg]) => ({ period, yieldKg: round(yieldKg, 0) }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const averageYieldKg = predictions.length
      ? round(average((predictions as any[]).map((item) => item.expectedYieldKg ?? 0)), 0)
      : 0;

    const snapshot: YieldAnalyticsSnapshot = {
      scope: 'global',
      periodType: 'monthly',
      periodStart,
      periodEnd,
      cropWiseYield,
      regionWiseYield,
      monthlyYield,
      seasonWiseYield,
      averageYieldKg,
      yieldTrend,
      topPerformingCrops,
      generatedAt: now,
    };

    await this.yieldMongoService.upsertAnalytics('global', 'monthly', periodStart, snapshot as any);
    return snapshot;
  }

  async getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit = 12): Promise<any[]> {
    return this.yieldMongoService.findAnalytics(regionLevel, regionName, periodType, limit);
  }
}
