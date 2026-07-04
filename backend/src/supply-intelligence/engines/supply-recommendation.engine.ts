import { Injectable } from '@nestjs/common';
import type { SupplyAssessmentContext, SupplyRecommendation, SupplyRiskResult } from '../interfaces/supply-intelligence.types';
import { formatPercent } from '../../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class SupplyRecommendationEngine {
  recommend(context: SupplyAssessmentContext, risk: SupplyRiskResult, supplyDropPercent: number): SupplyRecommendation[] {
    const recommendations: SupplyRecommendation[] = [];

    if (risk.level === 'high' || risk.level === 'critical') {
      recommendations.push({
        action: 'Accelerate harvest and collection',
        expectedImpact: 'Reduces exposure to weather and movement delays',
        confidence: 88,
        priority: 1,
        explanation: 'High supply risk justifies faster harvest and aggregation timing.',
      });
    }

    if (context.weather.hasFloodRisk || context.weather.hasHeatStress) {
      recommendations.push({
        action: 'Protect harvested stock and transport routes',
        expectedImpact: 'Preserves marketable supply during adverse weather',
        confidence: 82,
        priority: 1,
        explanation: 'Weather stress is active and can lower available supply quickly.',
      });
    }

    if (context.yieldRiskLevel === 'high' || context.yieldRiskLevel === 'critical') {
      recommendations.push({
        action: 'Re-check disease and irrigation controls',
        expectedImpact: 'Limits further standing-crop loss before harvest',
        confidence: 80,
        priority: 2,
        explanation: 'Yield pressure can cascade into smaller supply volumes.',
      });
    }

    if (context.harvestReadinessScore < 55 || supplyDropPercent >= 20) {
      recommendations.push({
        action: 'Synchronise labour and logistics plans',
        expectedImpact: 'Improves harvest throughput and availability timing',
        confidence: 79,
        priority: 2,
        explanation: `Readiness is lagging and projected supply gap is ${formatPercent(supplyDropPercent)}.`,
      });
    }

    if (context.regionalEventNotes.length > 0) {
      recommendations.push({
        action: 'Monitor regional movement constraints',
        expectedImpact: 'Avoids avoidable distribution delays',
        confidence: 74,
        priority: 3,
        explanation: 'Regional conditions may affect aggregated supply timing.',
      });
    }

    if (!recommendations.length) {
      recommendations.push({
        action: 'Maintain current supply plan',
        expectedImpact: 'Keeps supply trajectory stable',
        confidence: 65,
        priority: 3,
        explanation: 'No major corrective action is needed right now.',
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority || b.confidence - a.confidence);
  }
}