import { Injectable } from '@nestjs/common';
import type { DemandAssessmentContext } from '../interfaces/demand-intelligence.types';
import { average, clamp } from '../../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class DemandConfidenceCalculatorEngine {
  calculate(context: DemandAssessmentContext, expectedDemandKg: number, currentDemandKg: number): number {
    let confidence = 52;

    // Market price data quality
    const hasPriceData = context.marketModalPrice > 0;
    const hasArrivalData = context.recentArrivalQty > 0;
    confidence += hasPriceData ? 10 : -12;
    confidence += hasArrivalData ? 6 : -8;

    // Price trend clarity
    if (context.marketTrendDirection === 'stable') confidence += 6;
    if (context.marketTrendDirection === 'rising') confidence += 2;
    if (context.marketTrendDirection === 'falling') confidence -= 4;

    // Supply confidence carries over
    confidence += context.yieldConfidence >= 75 ? 8 : context.yieldConfidence < 50 ? -10 : 0;

    // Harvest readiness
    confidence += context.harvestReadinessScore >= 70 ? 8 : context.harvestReadinessScore < 40 ? -8 : 0;

    // Supply availability
    const supplyRatio = expectedDemandKg > 0 && context.availableSupplyKg > 0
      ? context.availableSupplyKg / expectedDemandKg
      : 0;
    confidence += supplyRatio >= 0.9 ? 6 : supplyRatio < 0.5 ? -8 : 0;

    // Historical demand stabilises confidence
    if (context.historicalDemandKg.length >= 3) {
      const avgHistorical = average(context.historicalDemandKg);
      const variance = avgHistorical > 0
        ? Math.abs(expectedDemandKg - avgHistorical) / avgHistorical
        : 0;
      confidence += variance < 0.15 ? 8 : variance < 0.30 ? 2 : -6;
    }

    // Government / export signals add certainty
    if (context.isMspCrop) confidence += 5;
    if (context.isExportCrop) confidence += 4;

    // Adverse conditions reduce confidence
    if (context.weather.hasFloodRisk || context.weather.hasHeatStress) confidence -= 6;
    if (context.regionalEventNotes.length > 0) confidence -= 5;
    if (context.yieldRiskLevel === 'critical') confidence -= 10;

    return clamp(Math.round(confidence), 0, 100);
  }
}
