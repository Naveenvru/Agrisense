import { Injectable } from '@nestjs/common';
import type { SupplyEstimatorStrategy } from '../interfaces/supply-estimator.interface';
import type { SupplyAssessmentContext, SupplyPredictionResult, SupplyTimelinePoint, SupplySeasonalAnalysis } from '../interfaces/supply-intelligence.types';
import { clamp, formatPercent, lower, round, safeNumber } from '../../yield-intelligence/utils/yield-rule.utils';
import { SupplyRiskAnalyzerEngine } from './supply-risk-analyzer.engine';
import { SupplyConfidenceCalculatorEngine } from './supply-confidence-calculator.engine';
import { SupplyRecommendationEngine } from './supply-recommendation.engine';

@Injectable()
export class RuleBasedSupplyEstimatorEngine implements SupplyEstimatorStrategy {
  constructor(
    private readonly riskAnalyzer: SupplyRiskAnalyzerEngine,
    private readonly confidenceCalculator: SupplyConfidenceCalculatorEngine,
    private readonly recommendationEngine: SupplyRecommendationEngine,
  ) {}

  estimate(context: SupplyAssessmentContext): SupplyPredictionResult {
    const explanations: string[] = [];
    const areaAcres = Math.max(0.1, safeNumber(context.areaAcres, 1));

    const baseSupplyPerAcre = this.resolveBaseSupplyPerAcre(context);
    const harvestFactor = this.resolveHarvestFactor(context);
    const yieldFactor = this.resolveYieldFactor(context);
    const weatherFactor = this.resolveWeatherFactor(context);
    const activityFactor = this.resolveActivityFactor(context.activities.completionRate);
    const regionFactor = this.resolveRegionFactor(context.regionLevel, context.regionName);
    const historicalFactor = this.resolveHistoricalFactor(context.historicalSupplyKg, baseSupplyPerAcre);

    const factors = [harvestFactor, yieldFactor, weatherFactor, activityFactor, regionFactor, historicalFactor];
    const projectedSupplyPerAcre = round(baseSupplyPerAcre * factors.reduce((product, factor) => product * factor, 1), 2);
    const expectedSupplyKg = Math.max(0, Math.round(projectedSupplyPerAcre * areaAcres));

    const preliminaryRisk = this.riskAnalyzer.analyze(context, expectedSupplyKg, Math.round(expectedSupplyKg * 0.9));
    const availableSupplyKg = Math.max(0, Math.round(expectedSupplyKg * this.resolveAvailabilityFactor(context, preliminaryRisk.score)));
    const risk = this.riskAnalyzer.analyze(context, expectedSupplyKg, availableSupplyKg);
    const confidence = this.confidenceCalculator.calculate(context, expectedSupplyKg, availableSupplyKg);
    const supplyDensityKgPerAcre = round(expectedSupplyKg / areaAcres, 2);
    const supplyDropPercent = expectedSupplyKg > 0 ? Math.max(0, ((expectedSupplyKg - availableSupplyKg) / expectedSupplyKg) * 100) : 0;
    const recommendations = this.recommendationEngine.recommend(context, risk, supplyDropPercent);
    const timeline = this.buildTimeline(context, expectedSupplyKg, availableSupplyKg);
    const seasonalAnalysis = this.buildSeasonalAnalysis(context, expectedSupplyKg, availableSupplyKg);
    const confidenceBand = confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';

    explanations.push(
      `Base supply benchmark for ${context.cropName} is ${round(baseSupplyPerAcre, 0)} kg/acre`,
      `Adjusted by harvest (${formatPercent((harvestFactor - 1) * 100)}), yield (${formatPercent((yieldFactor - 1) * 100)}), weather (${formatPercent((weatherFactor - 1) * 100)}), activities (${formatPercent((activityFactor - 1) * 100)}), region (${formatPercent((regionFactor - 1) * 100)}), and history (${formatPercent((historicalFactor - 1) * 100)})`,
      risk.explanation,
      `Available supply projected at ${availableSupplyKg} kg after operational and weather adjustments.`,
      seasonalAnalysis.explanation,
      recommendations.map((item) => item.explanation).join(' '),
    );

    const summary = availableSupplyKg < expectedSupplyKg
      ? `Expected supply reduced from ${expectedSupplyKg} kg to ${availableSupplyKg} kg after ${formatPercent(supplyDropPercent)} projected constraints.`
      : `Expected supply remains at ${availableSupplyKg} kg with stable harvest and logistics conditions.`;

    return {
      farmerCropId: context.farmerCropId,
      farmerProfileId: context.farmerProfileId,
      cropName: context.cropName,
      cropVariety: context.cropVariety,
      cropCategory: context.cropCategory,
      regionLevel: context.regionLevel,
      regionName: context.regionName,
      areaAcres,
      expectedHarvestDate: context.expectedHarvestDate ?? null,
      expectedSupplyKg,
      expectedYieldKg: context.yieldExpectedKg,
      availableSupplyKg,
      supplyDensityKgPerAcre,
      confidence,
      confidenceBand,
      explanation: summary,
      explanations,
      risk,
      seasonalAnalysis,
      timeline,
      recommendations,
      harvestStage: context.harvestStage,
      yieldStage: context.yieldRiskLevel,
      weatherSummary: context.weather.weatherCondition ?? 'stable weather',
      assessedAt: new Date(),
      version: 1,
    };
  }

  private resolveBaseSupplyPerAcre(context: SupplyAssessmentContext): number {
    const fallback = context.yieldExpectedKg > 0 && context.areaAcres > 0 ? context.yieldExpectedKg / context.areaAcres : 1800;
    const harvestSignal = context.harvestReadinessScore > 0 ? context.harvestReadinessScore / 100 : 1;
    return Math.max(500, fallback * (0.85 + harvestSignal * 0.25));
  }

  private resolveHarvestFactor(context: SupplyAssessmentContext): number {
    const stage = lower(context.harvestStage);
    let factor = 1;
    if (stage.includes('ready')) factor += 0.08;
    if (stage.includes('delayed') || stage.includes('overdue')) factor -= 0.18;
    if (context.harvestReadinessScore >= 80) factor += 0.05;
    if (context.harvestReadinessScore < 40) factor -= 0.12;
    return clamp(factor, 0.7, 1.15);
  }

  private resolveYieldFactor(context: SupplyAssessmentContext): number {
    let factor = 1;
    if (context.yieldRiskLevel === 'low') factor += 0.06;
    if (context.yieldRiskLevel === 'high') factor -= 0.14;
    if (context.yieldRiskLevel === 'critical') factor -= 0.22;
    if (context.yieldConfidence >= 80) factor += 0.05;
    if (context.yieldConfidence < 55) factor -= 0.1;
    return clamp(factor, 0.7, 1.12);
  }

  private resolveWeatherFactor(context: SupplyAssessmentContext): number {
    const temp = safeNumber(context.weather.currentTemperature, 26);
    const rain = safeNumber(context.weather.currentRainfall, 0);
    let factor = 1;
    if (context.weather.hasFloodRisk) factor -= 0.12;
    if (context.weather.hasHeatStress) factor -= 0.08;
    if (context.weather.hasRainForecast) factor -= 0.04;
    if (temp >= 38) factor -= 0.05;
    if (rain > 30) factor -= 0.06;
    return clamp(factor, 0.72, 1.06);
  }

  private resolveActivityFactor(completionRate: number): number {
    return clamp(0.8 + (clamp(completionRate, 0, 100) / 100) * 0.24, 0.8, 1.04);
  }

  private resolveRegionFactor(regionLevel: string, regionName: string): number {
    const name = lower(regionName);
    let factor = regionLevel === 'state' ? 1.02 : regionLevel === 'district' ? 1.01 : 1;
    if (name.includes('highland')) factor -= 0.03;
    return clamp(factor, 0.96, 1.05);
  }

  private resolveHistoricalFactor(samples: number[], benchmarkPerAcre: number): number {
    if (!samples.length) return 1;
    const avgHistorical = samples.reduce((sum, value) => sum + value, 0) / samples.length;
    const delta = Math.abs(avgHistorical - benchmarkPerAcre) / Math.max(benchmarkPerAcre, 1);
    if (delta < 0.12) return 1.05;
    if (delta < 0.25) return 1.02;
    if (delta < 0.4) return 0.98;
    return 0.94;
  }

  private resolveAvailabilityFactor(context: SupplyAssessmentContext, riskScore: number): number {
    let factor = 0.92;
    if (context.harvestReadinessScore >= 80) factor += 0.06;
    if (context.weather.hasFloodRisk || context.weather.hasHeatStress) factor -= 0.08;
    if (context.yieldRiskLevel === 'high' || context.yieldRiskLevel === 'critical') factor -= 0.1;
    if (riskScore >= 70) factor -= 0.08;
    if (context.regionalEventNotes.length > 0) factor -= 0.04;
    return clamp(factor, 0.68, 1.02);
  }

  private buildTimeline(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): SupplyTimelinePoint[] {
    const now = new Date();
    const harvestDate = context.expectedHarvestDate ?? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const peakDate = new Date(harvestDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const declineDate = new Date(peakDate.getTime() + 21 * 24 * 60 * 60 * 1000);

    return [
      { label: 'today', date: now, expectedSupplyKg: Math.round(expectedSupplyKg * 0.15), availableSupplyKg: Math.round(availableSupplyKg * 0.1), explanation: 'Current day supply is limited to already harvested stock.' },
      { label: 'next-week', date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), expectedSupplyKg: Math.round(expectedSupplyKg * 0.3), availableSupplyKg: Math.round(availableSupplyKg * 0.25), explanation: 'Next week supply expands as harvest activity progresses.' },
      { label: 'next-month', date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), expectedSupplyKg: Math.round(expectedSupplyKg * 0.75), availableSupplyKg: Math.round(availableSupplyKg * 0.7), explanation: 'Next month supply reflects the main harvest window.' },
      { label: 'harvest-window', date: harvestDate, expectedSupplyKg, availableSupplyKg, explanation: 'Harvest window carries the main expected supply volume.' },
      { label: 'supply-peak', date: peakDate, expectedSupplyKg: Math.round(expectedSupplyKg * 1.02), availableSupplyKg: Math.round(availableSupplyKg * 1.02), explanation: 'Supply peak occurs shortly after harvest completion and aggregation.' },
      { label: 'supply-decline', date: declineDate, expectedSupplyKg: Math.round(expectedSupplyKg * 0.62), availableSupplyKg: Math.round(availableSupplyKg * 0.6), explanation: 'Supply decline reflects post-peak movement into market channels.' },
    ];
  }

  private buildSeasonalAnalysis(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): SupplySeasonalAnalysis {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonth = nextMonthDate.toISOString().slice(0, 7);
    const currentSeason = lower(String(context.cropCategory ?? 'current')) || 'current';
    const nextSeason = currentSeason.includes('grain') ? 'next-cereal' : currentSeason.includes('vegetable') ? 'next-vegetable' : 'next';

    return {
      currentSeasonSupplyKg: availableSupplyKg,
      nextSeasonSupplyKg: Math.round(expectedSupplyKg * 0.65),
      monthlySupply: { [currentMonth]: availableSupplyKg, [nextMonth]: Math.round(expectedSupplyKg * 0.58) },
      weeklySupply: { week1: Math.round(availableSupplyKg * 0.25), week2: Math.round(availableSupplyKg * 0.45), week3: Math.round(availableSupplyKg * 0.7), week4: availableSupplyKg },
      cropWiseSeasonalDistribution: { [context.cropName]: availableSupplyKg, [`${context.cropName}-${nextSeason}`]: Math.round(expectedSupplyKg * 0.35) },
      explanation: `Seasonal supply analysis projects ${availableSupplyKg} kg in the current season and ${Math.round(expectedSupplyKg * 0.65)} kg in the next season for ${context.cropName}.`,
    };
  }
}