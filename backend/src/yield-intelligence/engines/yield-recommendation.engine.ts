import { Injectable } from '@nestjs/common';
import type { YieldRecommendationEngine } from '../interfaces/yield-recommendation.interface';
import type { YieldAssessmentContext, YieldRecommendation, YieldRiskResult, YieldLossResult, YieldConfidenceResult } from '../interfaces/yield-intelligence.types';

@Injectable()
export class YieldRecommendationEngineImpl implements YieldRecommendationEngine {
  recommend(
    context: YieldAssessmentContext,
    risk: YieldRiskResult,
    loss: YieldLossResult,
    confidence: YieldConfidenceResult,
  ): YieldRecommendation[] {
    const recommendations: YieldRecommendation[] = [];

    if (context.weather.hasHeatStress || (context.weather.currentTemperature ?? 26) >= 38) {
      recommendations.push({
        action: 'Increase irrigation frequency',
        expectedImpact: 'Reduces heat stress and supports grain filling',
        confidence: 84,
        priority: 1,
        explanation: 'Heat stress is active, so additional moisture will protect yield potential.',
      });
    }

    if (context.soilFertilityScore < 55 || loss.reasons.some((reason) => reason.toLowerCase().includes('fertility'))) {
      recommendations.push({
        action: 'Apply fertilizer or nutrient correction',
        expectedImpact: 'Improves plant nutrition and crop uniformity',
        confidence: 78,
        priority: 1,
        explanation: 'Soil fertility indicators suggest nutrient supplementation is needed.',
      });
    }

    if (risk.level === 'high' || risk.level === 'critical') {
      recommendations.push({
        action: 'Monitor disease and pest pressure closely',
        expectedImpact: 'Detects problems early and limits downstream loss',
        confidence: 81,
        priority: 2,
        explanation: 'High risk conditions justify daily scouting and faster response times.',
      });
    }

    if (context.activities.hasLateIrrigation || context.activities.hasMissedActivities) {
      recommendations.push({
        action: 'Complete delayed farm activities immediately',
        expectedImpact: 'Improves growth consistency and stabilises yield',
        confidence: 88,
        priority: 1,
        explanation: 'Late activities are one of the fastest paths to avoidable yield loss.',
      });
    }

    if (context.lifecycle.daysRemaining <= 10 && confidence.confidence >= 70) {
      recommendations.push({
        action: 'Prepare for harvest',
        expectedImpact: 'Reduces post-maturity loss and improves produce quality',
        confidence: 82,
        priority: 2,
        explanation: 'The crop is nearing harvest readiness and operational preparation is prudent.',
      });
    }

    if (loss.expectedLossPercent >= 20) {
      recommendations.push({
        action: 'Review flood and drainage controls',
        expectedImpact: 'Protects crop area from waterlogging and runoff damage',
        confidence: 76,
        priority: 1,
        explanation: 'Current loss projection indicates water-related stress could become expensive.',
      });
    }

    if (!recommendations.length) {
      recommendations.push({
        action: 'Maintain current crop management plan',
        expectedImpact: 'Preserves the current yield trajectory',
        confidence: 65,
        priority: 3,
        explanation: 'No corrective action is required right now because crop conditions are stable.',
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority || b.confidence - a.confidence);
  }
}
