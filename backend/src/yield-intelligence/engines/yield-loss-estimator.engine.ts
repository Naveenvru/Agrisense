import { Injectable } from '@nestjs/common';
import type { YieldLossEstimator } from '../interfaces/yield-loss.interface';
import type { YieldAssessmentContext, YieldLossResult } from '../interfaces/yield-intelligence.types';
import type { YieldRiskResult } from '../interfaces/yield-intelligence.types';
import { clamp, formatPercent, lower } from '../utils/yield-rule.utils';

@Injectable()
export class YieldLossEstimatorEngine implements YieldLossEstimator {
  estimate(context: YieldAssessmentContext, yieldBeforeLossKg: number, riskScore: number): YieldLossResult {
    const reasons: string[] = [];
    let lossPercent = 0;

    if (context.weather.hasFloodRisk) {
      lossPercent += 12;
      reasons.push('Flood risk may damage roots or delay harvest operations');
    }

    if (context.weather.hasHeatStress) {
      lossPercent += 8;
      reasons.push('Heat stress reduces pollination and grain filling');
    }

    if (context.weather.hasRainForecast) {
      lossPercent += 5;
      reasons.push('Rain forecast may interrupt field operations');
    }

    if (context.activities.hasLateIrrigation) {
      lossPercent += 8;
      reasons.push('Late irrigation can cause water stress');
    }

    if (context.activities.hasLateFertilizer) {
      lossPercent += 6;
      reasons.push('Late fertilizer application can limit nutrient uptake');
    }

    if (context.soilFertilityScore < 50) {
      lossPercent += 7;
      reasons.push('Poor soil fertility can reduce nutrient availability');
    }

    const weatherCondition = lower(context.weather.weatherCondition);
    if (weatherCondition.includes('storm') || weatherCondition.includes('hail')) {
      lossPercent += 10;
      reasons.push('Severe weather can cause direct crop damage');
    }

    if (riskScore >= 70) {
      lossPercent += 6;
      reasons.push('Critical risk profile increases overall loss expectation');
    } else if (riskScore >= 45) {
      lossPercent += 3;
      reasons.push('Elevated risk profile increases potential loss');
    }

    const expectedLossPercent = clamp(Math.round(lossPercent), 0, 65);
    const expectedLossQuantityKg = Math.max(0, Math.round(yieldBeforeLossKg * (expectedLossPercent / 100)));

    const explanation = reasons.length
      ? `Expected yield loss is ${formatPercent(expectedLossPercent)} because ${reasons.join('; ').toLowerCase()}.`
      : 'Expected yield loss is low because current crop conditions are stable.';

    return {
      expectedLossPercent,
      expectedLossQuantityKg,
      reasons,
      explanation,
    };
  }
}
