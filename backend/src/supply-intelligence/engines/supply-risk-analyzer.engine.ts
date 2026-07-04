import { Injectable } from '@nestjs/common';
import type { SupplyRiskAnalyzer } from '../interfaces/supply-risk.interface';
import type { SupplyAssessmentContext, SupplyRiskResult } from '../interfaces/supply-intelligence.types';
import { clamp, formatPercent, lower, safeNumber } from '../../yield-intelligence/utils/yield-rule.utils';

@Injectable()
export class SupplyRiskAnalyzerEngine implements SupplyRiskAnalyzer {
  analyze(context: SupplyAssessmentContext, expectedSupplyKg: number, availableSupplyKg: number): SupplyRiskResult {
    const reasons: string[] = [];
    const mitigations: string[] = [];
    let score = 0;

    const supplyDropPercent = expectedSupplyKg > 0
      ? Math.max(0, ((expectedSupplyKg - availableSupplyKg) / expectedSupplyKg) * 100)
      : 0;

    if (supplyDropPercent >= 35) {
      score += 28;
      reasons.push('Projected available supply is materially below expected supply');
      mitigations.push('Review harvest logistics and post-harvest handling to reduce leakage');
    } else if (supplyDropPercent >= 20) {
      score += 16;
      reasons.push('Projected supply reduction is moderate');
    }

    if (context.weather.hasFloodRisk || safeNumber(context.weather.currentRainfall, 0) >= 45) {
      score += 20;
      reasons.push('Flood or heavy rainfall may delay harvest movement');
      mitigations.push('Improve drainage and prepare protected transport routes');
    }

    if (context.weather.hasHeatStress || (context.weather.currentTemperature ?? 0) >= 38) {
      score += 10;
      reasons.push('Heat stress can accelerate quality loss and shrink marketable supply');
      mitigations.push('Accelerate harvesting and shade harvested stock immediately');
    }

    if (context.harvestReadinessScore < 45 || lower(context.harvestStage).includes('delayed')) {
      score += 18;
      reasons.push('Harvest readiness is low or delayed');
      mitigations.push('Close any remaining harvest gaps and track field maturity daily');
    }

    if (context.yieldRiskLevel === 'high' || context.yieldRiskLevel === 'critical') {
      score += 16;
      reasons.push('Yield reduction risk is elevated');
      mitigations.push('Protect standing crop with closer irrigation and disease monitoring');
    }

    if (context.harvestRiskLevel === 'high' || context.harvestRiskLevel === 'critical') {
      score += 14;
      reasons.push('Harvest risk is already elevated');
      mitigations.push('Prepare equipment and labour to avoid further delay');
    }

    if (context.yieldExplanations.some((item) => /disease|pest/i.test(item))) {
      score += 12;
      reasons.push('Disease or pest pressure may reduce marketable volume');
      mitigations.push('Scout for disease and pests and apply control measures early');
    }

    if (context.regionalEventNotes.length > 0) {
      score += 8;
      reasons.push('Regional event conditions may affect movement or aggregation');
      mitigations.push('Monitor local logistics and market access conditions');
    }

    const level = score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
    const explanation = reasons.length
      ? `Supply risk is ${level} (${formatPercent(clamp(score, 0, 100))}) because ${reasons.join(', ').toLowerCase()}.`
      : 'Supply risk is low because harvest readiness, weather, and yield outlook are stable.';

    return {
      level,
      score: clamp(score, 0, 100),
      reasons,
      mitigationRecommendations: mitigations.length ? [...new Set(mitigations)] : ['Maintain current harvest and logistics plan'],
      explanation,
    };
  }
}