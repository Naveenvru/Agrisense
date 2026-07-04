import { Injectable } from '@nestjs/common';
import type { YieldEstimatorStrategy } from '../interfaces/yield-estimator.interface';
import type { YieldAssessmentContext, YieldPredictionResult } from '../interfaces/yield-intelligence.types';
import { YieldRiskAnalyzerEngine } from './yield-risk-analyzer.engine';
import { YieldConfidenceCalculatorEngine } from './yield-confidence-calculator.engine';
import { YieldQualityAssessorEngine } from './yield-quality-assessor.engine';
import { YieldLossEstimatorEngine } from './yield-loss-estimator.engine';
import { YieldRecommendationEngineImpl } from './yield-recommendation.engine';
import { average, clamp, containsAny, formatPercent, lower, round, safeNumber } from '../utils/yield-rule.utils';

@Injectable()
export class RuleBasedYieldEstimatorEngine implements YieldEstimatorStrategy {
  constructor(
    private readonly riskAnalyzer: YieldRiskAnalyzerEngine,
    private readonly confidenceCalculator: YieldConfidenceCalculatorEngine,
    private readonly qualityAssessor: YieldQualityAssessorEngine,
    private readonly lossEstimator: YieldLossEstimatorEngine,
    private readonly recommendationEngine: YieldRecommendationEngineImpl,
  ) {}

  estimate(context: YieldAssessmentContext): YieldPredictionResult {
    const explanations: string[] = [];

    const areaAcres = Math.max(0.1, safeNumber(context.areaAcres, 1));
    const cropBaseYieldPerAcre = this.resolveBaseYieldPerAcre(context.cropName, context.cropCategory);

    const soilFactor = this.resolveSoilFactor(context.soilType, context.soilFertilityScore);
    const irrigationFactor = this.resolveIrrigationFactor(context.irrigationType);
    const weatherFactor = this.resolveWeatherFactor(context);
    const lifecycleFactor = this.resolveLifecycleFactor(context.lifecycle.lifecycleStage, context.readinessScore);
    const activityFactor = this.resolveActivityFactor(context.activities.completionRate);
    const varietyFactor = this.resolveVarietyFactor(context.cropVariety);
    const historyFactor = this.resolveHistoryFactor(context.historicalYieldSamples, cropBaseYieldPerAcre);

    const factors = [soilFactor, irrigationFactor, weatherFactor, lifecycleFactor, activityFactor, varietyFactor, historyFactor];
    const estimatedYieldPerAcreBeforeLoss = round(cropBaseYieldPerAcre * factors.reduce((product, factor) => product * factor, 1), 2);
    const expectedProductionKg = Math.max(0, Math.round(estimatedYieldPerAcreBeforeLoss * areaAcres));

    const risk = this.riskAnalyzer.analyze(context);
    const confidenceAnalysis = this.confidenceCalculator.calculate(context, estimatedYieldPerAcreBeforeLoss);
    const quality = this.qualityAssessor.assess(context, estimatedYieldPerAcreBeforeLoss, confidenceAnalysis.confidence);
    const loss = this.lossEstimator.estimate(context, expectedProductionKg, risk.score);
    const expectedYieldKg = Math.max(0, expectedProductionKg - loss.expectedLossQuantityKg);
    const recommendations = this.recommendationEngine.recommend(context, risk, loss, confidenceAnalysis);

    explanations.push(
      `Base yield benchmark for ${context.cropName} is ${round(cropBaseYieldPerAcre, 0)} kg/acre`,
      `Adjusted by soil (${formatPercent((soilFactor - 1) * 100)}), irrigation (${formatPercent((irrigationFactor - 1) * 100)}), weather (${formatPercent((weatherFactor - 1) * 100)}), lifecycle (${formatPercent((lifecycleFactor - 1) * 100)}), activity (${formatPercent((activityFactor - 1) * 100)}), variety (${formatPercent((varietyFactor - 1) * 100)}), and history (${formatPercent((historyFactor - 1) * 100)})`,
      risk.explanation,
      confidenceAnalysis.explanation,
      quality.explanation,
      loss.explanation,
      recommendations.map((item) => item.explanation).join(' '),
    );

    const summary = expectedYieldKg < expectedProductionKg
      ? `Expected yield reduced from ${expectedProductionKg} kg to ${expectedYieldKg} kg after ${formatPercent(loss.expectedLossPercent)} projected loss.`
      : `Expected yield remains at ${expectedYieldKg} kg with no material loss expected.`;

    return {
      farmerCropId: context.farmerCropId,
      farmerProfileId: context.farmerProfileId,
      cropName: context.cropName,
      cropVariety: context.cropVariety,
      cropCategory: context.cropCategory,
      areaAcres,
      soilType: context.soilType,
      soilFertilityScore: context.soilFertilityScore,
      irrigationType: context.irrigationType,
      lifecycleStage: context.lifecycle.lifecycleStage,
      growthPercentage: context.lifecycle.growthPercentage,
      readinessScore: context.readinessScore,
      currentWeatherSummary: context.weather.weatherCondition ?? 'stable weather',
      expectedYieldKg,
      yieldPerAcreKg: round(estimatedYieldPerAcreBeforeLoss, 2),
      expectedProductionKg,
      confidence: confidenceAnalysis.confidence,
      explanation: summary,
      explanations,
      risk,
      confidenceAnalysis,
      quality,
      loss,
      recommendations,
      historicalYieldKg: context.historicalYieldKg ?? null,
      historicalYieldSamples: context.historicalYieldSamples,
      weather: context.weather,
      weatherHistory: context.weatherHistory,
      activities: context.activities,
      lifecycle: context.lifecycle,
      assessedAt: new Date(),
      version: 1,
    };
  }

  private resolveBaseYieldPerAcre(cropName: string, cropCategory?: string | null): number {
    const name = lower(cropName);
    const category = lower(cropCategory);

    if (containsAny(name, ['paddy', 'rice'])) return 2600;
    if (containsAny(name, ['tomato'])) return 14000;
    if (containsAny(name, ['maize', 'corn'])) return 3200;
    if (containsAny(name, ['wheat'])) return 1800;
    if (containsAny(name, ['sugarcane'])) return 32000;
    if (containsAny(name, ['onion'])) return 11000;
    if (containsAny(category, ['vegetable'])) return 9000;
    if (containsAny(category, ['grain', 'cereal'])) return 2400;
    return 2000;
  }

  private resolveSoilFactor(soilType?: string | null, soilFertilityScore = 60): number {
    const soil = lower(soilType);
    let factor = 0.9 + (clamp(soilFertilityScore, 0, 100) / 250);

    if (containsAny(soil, ['loam', 'alluvial'])) factor += 0.08;
    if (containsAny(soil, ['black', 'regur'])) factor += 0.1;
    if (containsAny(soil, ['red'])) factor += 0.03;
    if (containsAny(soil, ['sandy'])) factor -= 0.08;
    if (containsAny(soil, ['clay'])) factor -= 0.02;
    if (containsAny(soil, ['saline', 'alkaline'])) factor -= 0.12;

    return clamp(factor, 0.72, 1.18);
  }

  private resolveIrrigationFactor(irrigationType?: string | null): number {
    const irrigation = lower(irrigationType);
    if (containsAny(irrigation, ['drip'])) return 1.08;
    if (containsAny(irrigation, ['sprinkler'])) return 1.04;
    if (containsAny(irrigation, ['canal', 'tank'])) return 1.02;
    if (containsAny(irrigation, ['bore', 'well'])) return 1.03;
    if (containsAny(irrigation, ['rainfed'])) return 0.9;
    return 1;
  }

  private resolveWeatherFactor(context: YieldAssessmentContext): number {
    const currentTemp = safeNumber(context.weather.currentTemperature, 26);
    const currentRain = safeNumber(context.weather.currentRainfall, 0);
    const historyTemps = context.weatherHistory.map((item) => item.temperature).filter((value): value is number => typeof value === 'number');
    const historyRain = context.weatherHistory.map((item) => item.rainfall).filter((value): value is number => typeof value === 'number');

    const avgTemp = historyTemps.length ? average(historyTemps) : currentTemp;
    const avgRain = historyRain.length ? average(historyRain) : currentRain;
    const tempPenalty = Math.min(0.18, Math.abs(currentTemp - avgTemp) / 200);
    const rainPenalty = Math.min(0.12, Math.abs(currentRain - avgRain) / 250);

    let factor = 1 - tempPenalty - rainPenalty;
    if (context.weather.hasHeatStress) factor -= 0.08;
    if (context.weather.hasFloodRisk) factor -= 0.1;
    if (context.weather.hasColdStress) factor -= 0.05;
    if (context.weather.hasRainForecast && !context.weather.hasFloodRisk) factor -= 0.02;

    return clamp(factor, 0.72, 1.08);
  }

  private resolveLifecycleFactor(lifecycleStage: string, readinessScore: number): number {
    const stage = lower(lifecycleStage);
    if (stage === 'ready') return 0.98;
    if (stage === 'ripening') return 1.02;
    if (stage === 'reproductive') return 1.04;
    if (stage === 'vegetative') return 1;
    if (stage === 'seedling') return 0.9;
    if (stage === 'overdue') return 0.95;
    return clamp(0.9 + (readinessScore / 500), 0.85, 1.05);
  }

  private resolveActivityFactor(completionRate: number): number {
    return clamp(0.78 + (clamp(completionRate, 0, 100) / 100) * 0.28, 0.78, 1.06);
  }

  private resolveVarietyFactor(cropVariety?: string | null): number {
    const variety = lower(cropVariety);
    if (!variety) return 1;
    if (containsAny(variety, ['hybrid', 'improved', 'certified'])) return 1.08;
    if (containsAny(variety, ['local', 'traditional'])) return 0.97;
    if (containsAny(variety, ['premium'])) return 1.05;
    return 1;
  }

  private resolveHistoryFactor(samples: number[], benchmarkPerAcre: number): number {
    if (!samples.length) return 1;
    const avgHistorical = average(samples);
    const delta = Math.abs(avgHistorical - benchmarkPerAcre) / Math.max(benchmarkPerAcre, 1);
    if (delta < 0.12) return 1.05;
    if (delta < 0.25) return 1.02;
    if (delta < 0.4) return 0.98;
    return 0.94;
  }
}
