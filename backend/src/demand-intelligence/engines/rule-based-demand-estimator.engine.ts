import { Injectable } from '@nestjs/common';
import type { DemandEstimatorStrategy } from '../interfaces/demand-estimator.interface';
import type {
  DemandAssessmentContext,
  DemandPredictionResult,
  DemandTimelinePoint,
  DemandSeasonalAnalysis,
} from '../interfaces/demand-intelligence.types';
import { clamp, formatPercent, lower, round, safeNumber } from '../../yield-intelligence/utils/yield-rule.utils';
import { DemandRiskAnalyzerEngine } from './demand-risk-analyzer.engine';
import { DemandConfidenceCalculatorEngine } from './demand-confidence-calculator.engine';
import { DemandRecommendationEngine } from './demand-recommendation.engine';

/**
 * Festival demand calendar — month-based lookup (1-indexed).
 * Captures the 4 major Indian agricultural demand peaks.
 */
const FESTIVAL_DEMAND_MULTIPLIERS: Record<number, number> = {
  1: 1.20,  // Pongal / Makar Sankranti (Jan) — grain/sugar demand surge
  4: 1.12,  // Ugadi / Baisakhi (Apr) — seasonal festival premium
  8: 1.08,  // Onam (Aug) — Kerala harvest festival
  10: 1.25, // Navratri lead-in (Oct) — pulse/grain demand spike
  11: 1.25, // Diwali (Nov) — largest demand premium
};

/**
 * Crops with guaranteed government MSP procurement floor demand.
 * Partial lowercase match used — extend this list as master-data grows.
 */
const MSP_CROP_KEYWORDS = [
  'rice', 'paddy', 'wheat', 'jowar', 'bajra', 'maize', 'ragi', 'barley',
  'gram', 'tur', 'moong', 'urad', 'lentil', 'groundnut', 'sunflower',
  'soybean', 'rapeseed', 'mustard', 'cotton', 'jute', 'sugarcane',
];

/**
 * Crops with significant export demand premium.
 */
const EXPORT_CROP_KEYWORDS = [
  'rice', 'basmati', 'onion', 'mango', 'banana', 'grapes', 'pomegranate',
  'cotton', 'castor', 'cumin', 'turmeric', 'chilli', 'pepper', 'guar',
  'sesame', 'groundnut', 'soybean',
];

@Injectable()
export class RuleBasedDemandEstimatorEngine implements DemandEstimatorStrategy {
  constructor(
    private readonly riskAnalyzer: DemandRiskAnalyzerEngine,
    private readonly confidenceCalculator: DemandConfidenceCalculatorEngine,
    private readonly recommendationEngine: DemandRecommendationEngine,
  ) {}

  estimate(context: DemandAssessmentContext): DemandPredictionResult {
    const explanations: string[] = [];
    const areaAcres = Math.max(0.1, safeNumber(context.areaAcres, 1));

    // ─── Resolve demand factors ────────────────────────────────────────────
    const baseDemandPerAcre = this.resolveBaseDemandPerAcre(context);
    const priceFactor = this.resolvePriceFactor(context);
    const supplyFactor = this.resolveSupplyFactor(context);
    const seasonFactor = this.resolveSeasonFactor(context);
    const festivalFactor = this.resolveFestivalFactor(context.currentMonth);
    const exportFactor = this.resolveExportFactor(context);
    const procurementFactor = this.resolveProcurementFactor(context);
    const weatherFactor = this.resolveWeatherFactor(context);
    const historicalFactor = this.resolveHistoricalFactor(context.historicalDemandKg, baseDemandPerAcre);

    const factors = [priceFactor, supplyFactor, seasonFactor, festivalFactor, exportFactor, procurementFactor, weatherFactor, historicalFactor];
    const projectedDemandPerAcre = round(baseDemandPerAcre * factors.reduce((product, f) => product * f, 1), 2);
    const expectedDemandKg = Math.max(0, Math.round(projectedDemandPerAcre * areaAcres));

    // Current demand = min of available supply and expected demand (actual market clearing)
    const currentDemandKg = Math.max(0, Math.min(expectedDemandKg, context.availableSupplyKg > 0 ? context.availableSupplyKg : expectedDemandKg));

    // ─── Demand channel breakdown ─────────────────────────────────────────
    const governmentProcurementKg = context.isMspCrop
      ? Math.round(expectedDemandKg * 0.28)
      : Math.round(expectedDemandKg * 0.05);

    const exportDemandKg = context.isExportCrop
      ? Math.round(expectedDemandKg * 0.22)
      : Math.round(expectedDemandKg * 0.04);

    const festivalDemandKg = Math.round(expectedDemandKg * (festivalFactor - 1) * 0.5);

    const industrialDemandKg = ['grain', 'oilseed', 'pulses', 'sugarcane'].some((cat) =>
      lower(context.cropCategory ?? '').includes(cat),
    )
      ? Math.round(expectedDemandKg * 0.18)
      : Math.round(expectedDemandKg * 0.06);

    const retailDemandKg = Math.max(
      0,
      expectedDemandKg - governmentProcurementKg - exportDemandKg - industrialDemandKg,
    );

    const demandDensityKgPerAcre = round(expectedDemandKg / areaAcres, 2);
    const demandGapPercent = expectedDemandKg > 0
      ? Math.max(0, ((expectedDemandKg - currentDemandKg) / expectedDemandKg) * 100)
      : 0;

    // ─── Risk, confidence, recommendations ───────────────────────────────
    const risk = this.riskAnalyzer.analyze(context, expectedDemandKg, currentDemandKg);
    const confidence = this.confidenceCalculator.calculate(context, expectedDemandKg, currentDemandKg);
    const recommendations = this.recommendationEngine.recommend(context, risk, demandGapPercent);
    const timeline = this.buildDemandTimeline(context, expectedDemandKg, currentDemandKg);
    const seasonalAnalysis = this.buildSeasonalAnalysis(context, expectedDemandKg, currentDemandKg, festivalDemandKg);
    const confidenceBand: DemandPredictionResult['confidenceBand'] =
      confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';

    // ─── Explanations ─────────────────────────────────────────────────────
    explanations.push(
      `Base demand benchmark for ${context.cropName} is ${round(baseDemandPerAcre, 0)} kg/acre`,
      `Adjusted by price (${formatPercent((priceFactor - 1) * 100)}), supply pressure (${formatPercent((supplyFactor - 1) * 100)}), season (${formatPercent((seasonFactor - 1) * 100)}), festival (${formatPercent((festivalFactor - 1) * 100)}), export (${formatPercent((exportFactor - 1) * 100)}), procurement (${formatPercent((procurementFactor - 1) * 100)}), weather (${formatPercent((weatherFactor - 1) * 100)}), history (${formatPercent((historicalFactor - 1) * 100)})`,
      risk.explanation,
      `Current market-clearing demand is ${currentDemandKg} kg; total expected demand across all channels is ${expectedDemandKg} kg.`,
      seasonalAnalysis.explanation,
      recommendations.map((r) => r.explanation).join(' '),
    );

    const summary =
      currentDemandKg < expectedDemandKg
        ? `Demand is partially constrained to ${currentDemandKg} kg from ${expectedDemandKg} kg due to ${formatPercent(demandGapPercent)} supply shortfall.`
        : `Demand of ${expectedDemandKg} kg is fully supportable by available supply conditions.`;

    return {
      farmerCropId: context.farmerCropId,
      farmerProfileId: context.farmerProfileId,
      cropName: context.cropName,
      cropVariety: context.cropVariety,
      cropCategory: context.cropCategory,
      regionLevel: context.regionLevel,
      regionName: context.regionName,
      villageName: context.villageName,
      talukName: context.talukName,
      districtName: context.districtName,
      stateName: context.stateName,
      areaAcres,
      expectedHarvestDate: context.expectedHarvestDate ?? null,
      currentDemandKg,
      expectedDemandKg,
      governmentProcurementKg,
      exportDemandKg,
      retailDemandKg,
      industrialDemandKg,
      festivalDemandKg,
      demandDensityKgPerAcre,
      confidence,
      confidenceBand,
      explanation: summary,
      explanations,
      risk,
      seasonalAnalysis,
      timeline,
      recommendations,
      assessedAt: new Date(),
      version: 1,
    };
  }

  // ─── Factor resolution methods ───────────────────────────────────────────

  /** Base demand per acre derived from market price × yield benchmark */
  private resolveBaseDemandPerAcre(context: DemandAssessmentContext): number {
    const yieldPerAcre = context.yieldExpectedKg > 0 && context.areaAcres > 0
      ? context.yieldExpectedKg / context.areaAcres
      : 1800;

    // Market price elasticity: higher modal price → stronger demand signal
    const priceSignal = context.marketModalPrice > 0
      ? Math.min(1.25, 0.85 + (context.marketModalPrice / 5000) * 0.4)
      : 1.0;

    return Math.max(500, yieldPerAcre * priceSignal);
  }

  /** Rising price trend indicates tightening supply → demand pressure */
  private resolvePriceFactor(context: DemandAssessmentContext): number {
    let factor = 1;
    if (context.marketTrendDirection === 'rising') factor += 0.12;
    if (context.marketTrendDirection === 'falling') factor -= 0.08;
    if (context.marketModalPrice > 0 && context.marketMaxPrice > 0) {
      const priceElasticity = (context.marketModalPrice / context.marketMaxPrice);
      factor += (priceElasticity - 0.8) * 0.1;
    }
    return clamp(factor, 0.88, 1.18);
  }

  /** Low available supply relative to expected creates upward demand pressure */
  private resolveSupplyFactor(context: DemandAssessmentContext): number {
    if (context.availableSupplyKg <= 0 || context.expectedSupplyKg <= 0) return 1;
    const supplyRatio = context.availableSupplyKg / context.expectedSupplyKg;
    if (supplyRatio < 0.5) return 1.18;  // Severe shortage → high demand pressure
    if (supplyRatio < 0.7) return 1.12;
    if (supplyRatio < 0.85) return 1.06;
    if (supplyRatio >= 1.1) return 0.96; // Oversupply → demand relaxes
    return 1;
  }

  /** Kharif / rabi / zaid seasonal demand variation */
  private resolveSeasonFactor(context: DemandAssessmentContext): number {
    const season = lower(context.cropSeason ?? '');
    if (season.includes('kharif')) return 1.10; // Main season, high market activity
    if (season.includes('rabi')) return 1.05;
    if (season.includes('zaid')) return 1.02;
    // Use lifecycle as fallback — peak harvest months drive demand
    const month = context.currentMonth;
    if ([10, 11, 12, 1].includes(month)) return 1.10; // Post-kharif harvest
    if ([3, 4, 5].includes(month)) return 1.05;       // Post-rabi harvest
    return 1;
  }

  /** Festival calendar lookup — month-based demand premium */
  private resolveFestivalFactor(month: number): number {
    return clamp(FESTIVAL_DEMAND_MULTIPLIERS[month] ?? 1, 1, 1.30);
  }

  /** Export commodity flag → additional demand channel */
  private resolveExportFactor(context: DemandAssessmentContext): number {
    const cropLower = lower(context.cropName);
    const isExport = EXPORT_CROP_KEYWORDS.some((keyword) => cropLower.includes(keyword));
    return isExport ? 1.20 : 1.0;
  }

  /** MSP crop → government floor demand is always present */
  private resolveProcurementFactor(context: DemandAssessmentContext): number {
    const cropLower = lower(context.cropName);
    const isMsp = MSP_CROP_KEYWORDS.some((keyword) => cropLower.includes(keyword));
    return isMsp ? 1.15 : 1.0;
  }

  /** Adverse weather on supply side → demand absorbs less, but pressure mounts */
  private resolveWeatherFactor(context: DemandAssessmentContext): number {
    let factor = 1;
    if (context.weather.hasFloodRisk) factor += 0.08;   // Supply disruption → demand pressure
    if (context.weather.hasHeatStress) factor += 0.06;
    if (context.weather.hasColdStress) factor += 0.04;
    return clamp(factor, 1.0, 1.20);
  }

  /** Historical demand samples stabilise extreme estimates */
  private resolveHistoricalFactor(samples: number[], benchmarkPerAcre: number): number {
    if (!samples.length) return 1;
    const avgHistorical = samples.reduce((sum, v) => sum + v, 0) / samples.length;
    const delta = Math.abs(avgHistorical - benchmarkPerAcre) / Math.max(benchmarkPerAcre, 1);
    if (delta < 0.12) return 1.05;
    if (delta < 0.25) return 1.02;
    if (delta < 0.40) return 0.98;
    return 0.94;
  }

  /** 6-point demand timeline from today through decline */
  private buildDemandTimeline(
    context: DemandAssessmentContext,
    expectedDemandKg: number,
    currentDemandKg: number,
  ): DemandTimelinePoint[] {
    const now = new Date();
    const harvestDate = context.expectedHarvestDate ?? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const peakDate = new Date(harvestDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const declineDate = new Date(peakDate.getTime() + 21 * 24 * 60 * 60 * 1000);

    return [
      {
        label: 'today',
        date: now,
        expectedDemandKg: Math.round(expectedDemandKg * 0.12),
        currentDemandKg: Math.round(currentDemandKg * 0.10),
        explanation: 'Current demand is limited to existing market stock before fresh harvest arrives.',
      },
      {
        label: 'next-week',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        expectedDemandKg: Math.round(expectedDemandKg * 0.28),
        currentDemandKg: Math.round(currentDemandKg * 0.24),
        explanation: 'Demand builds as harvest activity commences and supply begins to flow.',
      },
      {
        label: 'next-month',
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        expectedDemandKg: Math.round(expectedDemandKg * 0.72),
        currentDemandKg: Math.round(currentDemandKg * 0.68),
        explanation: 'Main harvest window drives peak procurement demand.',
      },
      {
        label: 'harvest-window',
        date: harvestDate,
        expectedDemandKg,
        currentDemandKg,
        explanation: 'Harvest window carries the peak demand across all channels.',
      },
      {
        label: 'demand-peak',
        date: peakDate,
        expectedDemandKg: Math.round(expectedDemandKg * 1.05),
        currentDemandKg: Math.round(currentDemandKg * 1.04),
        explanation: 'Demand peaks shortly after full harvest completion and market aggregation.',
      },
      {
        label: 'demand-decline',
        date: declineDate,
        expectedDemandKg: Math.round(expectedDemandKg * 0.60),
        currentDemandKg: Math.round(currentDemandKg * 0.58),
        explanation: 'Demand declines as market channel inventory builds and seasonal pressure eases.',
      },
    ];
  }

  /** Weekly / monthly / seasonal demand breakdown */
  private buildSeasonalAnalysis(
    context: DemandAssessmentContext,
    expectedDemandKg: number,
    currentDemandKg: number,
    festivalDemandKg: number,
  ): DemandSeasonalAnalysis {
    const currentMonthStr = new Date().toISOString().slice(0, 7);
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonthStr = nextMonthDate.toISOString().slice(0, 7);

    const currentSeasonLabel = lower(context.cropSeason ?? 'current');
    const nextSeasonLabel = currentSeasonLabel.includes('kharif') ? 'rabi' : currentSeasonLabel.includes('rabi') ? 'zaid' : 'next';

    return {
      currentSeasonDemandKg: currentDemandKg,
      nextSeasonDemandKg: Math.round(expectedDemandKg * 0.60),
      monthlyDemand: {
        [currentMonthStr]: currentDemandKg,
        [nextMonthStr]: Math.round(expectedDemandKg * 0.55),
      },
      weeklyDemand: {
        week1: Math.round(currentDemandKg * 0.22),
        week2: Math.round(currentDemandKg * 0.44),
        week3: Math.round(currentDemandKg * 0.72),
        week4: currentDemandKg,
      },
      cropWiseSeasonalDistribution: {
        [context.cropName]: currentDemandKg,
        [`${context.cropName}-${nextSeasonLabel}`]: Math.round(expectedDemandKg * 0.32),
      },
      festivalPremiumKg: festivalDemandKg,
      explanation: `Seasonal demand analysis projects ${currentDemandKg} kg in the current season and ${Math.round(expectedDemandKg * 0.60)} kg in the next for ${context.cropName}. Festival premium adds ${festivalDemandKg} kg in current period.`,
    };
  }
}
