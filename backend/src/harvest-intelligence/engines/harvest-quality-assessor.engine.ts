import { Injectable } from '@nestjs/common';
import type { IHarvestQualityAssessor } from '../interfaces/harvest-quality.interface';
import type { WeatherContext, ActivityContext, LifecycleContext, QualityEstimate } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestQualityAssessorEngine implements IHarvestQualityAssessor {
  assessQuality(
    weather: WeatherContext,
    activities: ActivityContext,
    cropVariety: string | null,
    lifecycle: LifecycleContext,
  ): QualityEstimate {
    const factors: string[] = [];
    let qualityScore = 80;

    if (weather.hasHeatStress) { qualityScore -= 20; factors.push('Heat stress reduces grain quality'); }
    if (weather.hasColdStress) { qualityScore -= 15; factors.push('Cold stress affects crop development'); }
    if ((weather.forecastRainProbability ?? 0) > 70) { qualityScore -= 10; factors.push('High rainfall risk may cause fungal issues'); }
    if (activities.hasMissedActivities) { qualityScore -= 10; factors.push('Missed farm activities reduce quality'); }
    if (activities.completionRate > 80) { qualityScore += 10; factors.push('Excellent farm activity completion'); }
    if (lifecycle.lifecycleStage === 'overdue') { qualityScore -= 15; factors.push('Over-maturity detected — quality degrading'); }
    if (cropVariety) factors.push(`Crop variety: ${cropVariety}`);

    const grade = qualityScore >= 75 ? 'A' : qualityScore >= 55 ? 'B' : 'C';
    const explanation = `Quality grade ${grade}: ${factors.join('; ')}`;

    return { grade: grade as any, explanation, factors };
  }
}
