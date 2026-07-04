import { Injectable } from '@nestjs/common';
import type { SupplyAssessmentContext } from '../interfaces/supply-intelligence.types';
import { average, clamp } from '../../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class SupplyConfidenceCalculatorEngine {
  calculate(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): number {
    const history = context.weatherHistory;
    const temperatures = history.map((entry) => entry.temperature).filter((value): value is number => typeof value === 'number');
    const rainfall = history.map((entry) => entry.rainfall).filter((value): value is number => typeof value === 'number');

    const tempStability = temperatures.length > 1
      ? Math.max(0, 100 - average(temperatures.map((value) => Math.abs(value - average(temperatures)))) * 4)
      : 80;

    const rainStability = rainfall.length > 1
      ? Math.max(0, 100 - average(rainfall.map((value) => Math.abs(value - average(rainfall)))) * 2)
      : 78;

    let confidence = 54;
    confidence += (tempStability - 50) * 0.15;
    confidence += (rainStability - 50) * 0.12;
    confidence += context.harvestReadinessScore >= 70 ? 10 : context.harvestReadinessScore < 40 ? -8 : 0;
    confidence += context.yieldConfidence >= 75 ? 8 : context.yieldConfidence < 50 ? -10 : 0;
    confidence += context.activities.completionRate >= 80 ? 8 : context.activities.completionRate < 55 ? -10 : 0;
    confidence += context.harvestRiskLevel === 'low' ? 5 : context.harvestRiskLevel === 'critical' ? -10 : 0;
    confidence += context.yieldRiskLevel === 'low' ? 5 : context.yieldRiskLevel === 'critical' ? -12 : 0;

    const supplyVariance = expectedSupplyKg > 0
      ? Math.abs(expectedSupplyKg - availableSupplyKg) / expectedSupplyKg
      : 0;

    confidence += supplyVariance < 0.1 ? 8 : supplyVariance < 0.25 ? 2 : -10;

    if (context.regionalEventNotes.length > 0) confidence -= 6;

    return clamp(Math.round(confidence), 0, 100);
  }
}