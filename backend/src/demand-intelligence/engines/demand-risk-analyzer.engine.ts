import { Injectable } from '@nestjs/common';
import type { DemandRiskAnalyzer } from '../interfaces/demand-risk.interface';
import type { DemandAssessmentContext, DemandRiskResult } from '../interfaces/demand-intelligence.types';
import { clamp, formatPercent, lower, safeNumber } from '../../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class DemandRiskAnalyzerEngine implements DemandRiskAnalyzer {
  analyze(context: DemandAssessmentContext, expectedDemandKg: number, currentDemandKg: number): DemandRiskResult {
    const reasons: string[] = [];
    const mitigations: string[] = [];
    let score = 0;

    // 1. Demand-supply imbalance (most critical signal)
    const supplyGap = expectedDemandKg > 0 && context.availableSupplyKg > 0
      ? ((expectedDemandKg - context.availableSupplyKg) / expectedDemandKg) * 100
      : 0;

    if (supplyGap >= 40) {
      score += 25;
      reasons.push('Demand significantly exceeds available supply — severe shortage risk');
      mitigations.push('Accelerate procurement and explore alternative sourcing regions');
    } else if (supplyGap >= 20) {
      score += 14;
      reasons.push('Demand moderately exceeds available supply');
      mitigations.push('Pre-book supply contracts to lock in volumes ahead of harvest');
    }

    // 2. Price spike risk
    const priceSpreadPercent = context.marketMinPrice > 0
      ? ((context.marketMaxPrice - context.marketMinPrice) / context.marketMinPrice) * 100
      : 0;

    if (context.marketTrendDirection === 'rising' && priceSpreadPercent > 30) {
      score += 20;
      reasons.push('Rising price trend with high price volatility increases procurement cost risk');
      mitigations.push('Hedge procurement through forward contracts or government MSP channels');
    } else if (context.marketTrendDirection === 'rising') {
      score += 10;
      reasons.push('Rising market price trend signals tightening supply');
    }

    // 3. Harvest readiness delay
    if (context.harvestReadinessScore < 45 || lower(context.harvestStage).includes('delayed')) {
      score += 15;
      reasons.push('Harvest is delayed — supply arrival into market will be deferred');
      mitigations.push('Engage with farmers on harvest readiness and logistics preparation');
    }

    // 4. Yield risk
    if (context.yieldRiskLevel === 'high' || context.yieldRiskLevel === 'critical') {
      score += 15;
      reasons.push('High yield risk may reduce final supply below demand requirements');
      mitigations.push('Identify alternative crop sources or varieties to cover potential shortfall');
    }

    // 5. Market arrival collapse
    if (context.recentArrivalQty > 0 && context.availableSupplyKg > 0) {
      const arrivalRatio = context.recentArrivalQty / (context.availableSupplyKg / 30);
      if (arrivalRatio < 0.4) {
        score += 12;
        reasons.push('Market arrival volumes are well below expected levels');
        mitigations.push('Investigate logistics bottlenecks and facilitate direct farm-to-market channels');
      }
    }

    // 6. Weather supply disruption
    if (context.weather.hasFloodRisk || context.weather.hasHeatStress) {
      score += 10;
      reasons.push('Adverse weather may disrupt crop movement and depress available supply');
      mitigations.push('Monitor weather-affected transport routes and activate emergency procurement');
    }

    // 7. Regional event disruption
    if (context.regionalEventNotes.length > 0) {
      score += 8;
      reasons.push('Regional conditions may constrain supply movement into demand centres');
      mitigations.push('Activate alternative procurement corridors and logistics partners');
    }

    const level = score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
    const explanation = reasons.length
      ? `Demand risk is ${level} (${formatPercent(clamp(score, 0, 100))}) because ${reasons.join(', ').toLowerCase()}.`
      : 'Demand risk is low — supply, prices, harvest, and regional conditions are all stable.';

    return {
      level,
      score: clamp(score, 0, 100),
      reasons,
      mitigationRecommendations: mitigations.length ? [...new Set(mitigations)] : ['Maintain current procurement and market access plan'],
      explanation,
    };
  }
}
