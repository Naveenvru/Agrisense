import { Injectable } from '@nestjs/common';
import type { IHarvestRiskAnalyzer } from '../interfaces/harvest-risk.interface';
import type { WeatherContext, ActivityContext, RiskLevel } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestRiskAnalyzerEngine implements IHarvestRiskAnalyzer {
  analyzeRisk(weather: WeatherContext, activities: ActivityContext) {
    const riskFactors: string[] = [];
    const mitigations: string[] = [];
    let riskPoints = 0;

    if (weather.hasFloodRisk) {
      riskPoints += 30;
      riskFactors.push('Flood risk detected from forecast data');
      mitigations.push('Monitor water levels and prepare drainage channels');
    }
    if (weather.hasHeatStress) {
      riskPoints += 20;
      riskFactors.push('High temperature stress — above crop optimal range');
      mitigations.push('Increase irrigation frequency to cool soil');
    }
    if (weather.hasColdStress) {
      riskPoints += 15;
      riskFactors.push('Cold stress detected — below crop minimum temperature');
      mitigations.push('Apply mulching to retain soil warmth');
    }
    if (weather.forecastRainProbability && weather.forecastRainProbability > 70) {
      riskPoints += 15;
      riskFactors.push(`High rain probability (${weather.forecastRainProbability}%) in forecast`);
      mitigations.push('Plan harvest before rain window; prepare covered storage');
    }
    if (activities.hasMissedActivities) {
      riskPoints += 10;
      riskFactors.push(`${activities.overduePendingEvents} farm activities are overdue`);
      mitigations.push('Complete pending irrigation and fertilizer applications immediately');
    }
    if (activities.completionRate < 60) {
      riskPoints += 10;
      riskFactors.push(`Low farm activity completion rate: ${activities.completionRate.toFixed(0)}%`);
      mitigations.push('Increase farm activity adherence to improve crop health');
    }

    const riskLevel = this.resolveRiskLevel(riskPoints);
    if (riskFactors.length === 0) {
      riskFactors.push('No significant risk factors detected');
    }
    if (mitigations.length === 0) {
      mitigations.push('Continue current farm management practices');
    }

    const explanation = `Risk level: ${riskLevel} (${riskPoints} risk points accumulated)`;
    return { riskLevel, riskPoints, riskFactors, mitigations, explanation };
  }

  private resolveRiskLevel(riskPoints: number): RiskLevel {
    if (riskPoints >= 60) return 'critical';
    if (riskPoints >= 35) return 'high';
    if (riskPoints >= 15) return 'medium';
    return 'low';
  }
}
