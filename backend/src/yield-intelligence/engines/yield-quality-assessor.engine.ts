import { Injectable } from '@nestjs/common';
import type { YieldQualityAssessor } from '../interfaces/yield-quality.interface';
import type { YieldAssessmentContext, YieldQualityResult } from '../interfaces/yield-intelligence.types';
import { clamp, containsAny, formatPercent } from '../utils/yield-rule.utils';

@Injectable()
export class YieldQualityAssessorEngine implements YieldQualityAssessor {
  assess(context: YieldAssessmentContext, yieldPerAcreKg: number, confidence: number): YieldQualityResult {
    const factors: string[] = [];
    let score = 65;

    if (confidence >= 85) {
      score += 12;
      factors.push('High prediction confidence supports better quality outlook');
    } else if (confidence < 55) {
      score -= 10;
      factors.push('Low prediction confidence lowers quality certainty');
    }

    if (!context.weather.hasHeatStress && !context.weather.hasFloodRisk) {
      score += 8;
      factors.push('Weather is currently stable');
    } else {
      score -= 10;
      factors.push('Weather stress is affecting crop quality');
    }

    if (context.soilFertilityScore >= 75) {
      score += 10;
      factors.push('Soil fertility is strong');
    } else if (context.soilFertilityScore < 45) {
      score -= 12;
      factors.push('Soil fertility is weak');
    }

    const variety = String(context.cropVariety ?? '').toLowerCase();
    if (containsAny(variety, ['hybrid', 'premium', 'certified'])) {
      score += 6;
      factors.push('Improved crop variety detected');
    } else if (containsAny(variety, ['local', 'traditional'])) {
      score -= 4;
      factors.push('Local variety may have lower uniformity');
    }

    if (context.readinessScore >= 80) {
      score += 8;
      factors.push('Crop harvest readiness is high');
    } else if (context.readinessScore < 35) {
      score -= 8;
      factors.push('Crop is still far from maturity');
    }

    if ((context.irrigationType ?? '').toLowerCase().includes('drip')) {
      score += 5;
      factors.push('Drip irrigation supports quality stability');
    }

    const grade = score >= 82 ? 'A' : score >= 62 ? 'B' : 'C';
    const explanation = `Yield quality is graded ${grade} because ${factors.join('; ').toLowerCase()}.`;

    return {
      grade,
      score: clamp(Math.round(score), 0, 100),
      factors,
      explanation,
    };
  }
}
