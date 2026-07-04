import { Injectable } from '@nestjs/common';
import type { IHarvestConfidenceCalculator } from '../interfaces/harvest-confidence.interface';
import type { LifecycleContext, WeatherContext, ActivityContext } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestConfidenceCalculatorEngine implements IHarvestConfidenceCalculator {
  calculateConfidence(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
    activities: ActivityContext,
  ) {
    let confidence = 80;

    if (lifecycle.growthPercentage > 80) confidence += 10;
    else if (lifecycle.growthPercentage < 20) confidence -= 20;

    if (!weather.hasFloodRisk && !weather.hasHeatStress && !weather.hasColdStress) confidence += 5;
    else confidence -= 15;

    if (activities.completionRate > 80) confidence += 5;
    else if (activities.completionRate < 40) confidence -= 10;

    const finalConf = Math.min(95, Math.max(20, Math.round(confidence)));
    const explanation = `Assessment confidence: ${finalConf}% (based on growth data, weather stability, and farm activity records)`;
    return { confidence: finalConf, explanation };
  }
}
