import { Injectable } from '@nestjs/common';
import type { YieldRiskAnalyzer } from '../interfaces/yield-risk.interface';
import type { YieldAssessmentContext, YieldRiskResult } from '../interfaces/yield-intelligence.types';
import { clamp, formatPercent, lower } from '../utils/yield-rule.utils';

@Injectable()
export class YieldRiskAnalyzerEngine implements YieldRiskAnalyzer {
  analyze(context: YieldAssessmentContext): YieldRiskResult {
    const reasons: string[] = [];
    const mitigations: string[] = [];

    let score = 0;

    const weatherRain = context.weather.currentRainfall ?? 0;
    const weatherTemp = context.weather.currentTemperature ?? 26;
    const weatherCondition = lower(context.weather.weatherCondition);

    if (context.weather.hasFloodRisk || weatherRain > 45 || weatherCondition.includes('rain')) {
      score += 30;
      reasons.push('Flood or heavy rainfall risk detected');
      mitigations.push('Improve drainage and avoid field entry during heavy rainfall');
    }

    if (context.weather.hasHeatStress || weatherTemp >= 38) {
      score += 18;
      reasons.push('Heat stress can reduce grain filling and fruit set');
      mitigations.push('Increase irrigation frequency and apply mulch where possible');
    }

    if (context.weather.hasColdStress || weatherTemp <= 12) {
      score += 12;
      reasons.push('Cold stress can slow crop development');
      mitigations.push('Delay sensitive sprays and protect seedlings from cold wind');
    }

    if (context.activities.hasLateIrrigation) {
      score += 18;
      reasons.push('Late irrigation activity detected');
      mitigations.push('Restore irrigation schedule immediately');
    }

    if (context.activities.hasLateFertilizer) {
      score += 12;
      reasons.push('Late fertilizer application detected');
      mitigations.push('Apply balanced fertilizer as soon as field conditions allow');
    }

    if (context.activities.hasMissedActivities) {
      score += 10;
      reasons.push('Some farm activities are overdue');
      mitigations.push('Complete missed activities to prevent yield loss');
    }

    if (context.soilFertilityScore < 45) {
      score += 14;
      reasons.push('Soil fertility is below optimal range');
      mitigations.push('Apply organic manure or nutrient corrections based on soil test');
    }

    if ((context.irrigationType ?? '').toLowerCase().includes('rainfed')) {
      score += 12;
      reasons.push('Rainfed irrigation increases dependency on weather');
      mitigations.push('Use supplemental irrigation during dry spells');
    }

    if (context.readinessScore < 35) {
      score += 8;
      reasons.push('Crop is still early in the growth cycle');
      mitigations.push('Monitor growth consistency and avoid stress events');
    }

    const level = score >= 70 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
    const explanation = reasons.length
      ? `Yield risk is ${level} (${formatPercent(clamp(score, 0, 100))}) because ${reasons.join(', ').toLowerCase()}.`
      : 'Yield risk is low because weather, soil, and farm activities are currently stable.';

    return {
      level,
      score: clamp(score, 0, 100),
      reasons,
      mitigationRecommendations: mitigations.length ? [...new Set(mitigations)] : ['Maintain current crop management practices'],
      explanation,
    };
  }
}
