import { Injectable } from '@nestjs/common';
import type { YieldConfidenceCalculator } from '../interfaces/yield-confidence.interface';
import type { YieldAssessmentContext, YieldConfidenceResult } from '../interfaces/yield-intelligence.types';
import { average, clamp, formatPercent, round } from '../utils/yield-rule.utils';

@Injectable()
export class YieldConfidenceCalculatorEngine implements YieldConfidenceCalculator {
  calculate(context: YieldAssessmentContext, yieldPerAcreKg: number): YieldConfidenceResult {
    const reasons: string[] = [];

    const history = context.weatherHistory;
    const temperatures = history.map((entry) => entry.temperature).filter((value): value is number => typeof value === 'number');
    const rainfalls = history.map((entry) => entry.rainfall).filter((value): value is number => typeof value === 'number');

    const temperatureStability = temperatures.length > 1
      ? Math.max(0, 100 - average(temperatures.map((value) => Math.abs(value - average(temperatures))) ) * 4)
      : 82;
    const rainfallStability = rainfalls.length > 1
      ? Math.max(0, 100 - average(rainfalls.map((value) => Math.abs(value - average(rainfalls))) ) * 2)
      : 80;

    let confidence = 58;

    confidence += (temperatureStability - 50) * 0.18;
    confidence += (rainfallStability - 50) * 0.12;

    if (context.riskLevelEquivalent?.toLowerCase?.() === 'low') confidence += 8;
    if (context.activities.completionRate >= 80) confidence += 10;
    if (context.activities.completionRate >= 95) confidence += 4;
    if (context.soilFertilityScore >= 70) confidence += 8;
    if (context.soilFertilityScore < 40) confidence -= 10;

    if (context.historicalYieldSamples.length > 0) {
      const historicalAvg = average(context.historicalYieldSamples);
      const delta = Math.abs(yieldPerAcreKg - historicalAvg) / Math.max(historicalAvg, 1);
      confidence += delta < 0.15 ? 8 : delta < 0.35 ? 3 : -7;
      reasons.push(`Historical yield comparison indicates ${(delta < 0.15 ? 'strong' : delta < 0.35 ? 'moderate' : 'weak')} consistency`);
    }

    const growthConsistency = context.lifecycle.durationDays > 0
      ? clamp(100 - Math.abs(context.lifecycle.growthPercentage - ((context.lifecycle.daysElapsed / context.lifecycle.durationDays) * 100)), 0, 100)
      : 70;
    confidence += (growthConsistency - 50) * 0.12;

    const band = confidence >= 85 ? 'very-high' : confidence >= 70 ? 'high' : confidence >= 50 ? 'medium' : 'low';
    const score = clamp(Math.round(confidence), 0, 100);

    if (context.activities.completionRate < 60) {
      reasons.push('Task completion is below target');
    }
    if (context.weather.hasFloodRisk || context.weather.hasHeatStress) {
      reasons.push('Weather variability is reducing confidence');
    }
    if (context.soilFertilityScore >= 70) {
      reasons.push('Soil fertility supports stable output');
    }

    const explanation = reasons.length
      ? `Yield confidence is ${formatPercent(score)} because ${reasons.join('; ').toLowerCase()}.`
      : `Yield confidence is ${formatPercent(score)} based on stable weather, healthy soil, and consistent crop progress.`;

    return { confidence: score, band, reasons, explanation };
  }
}
