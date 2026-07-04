import { Injectable } from '@nestjs/common';
import type { IHarvestDelayDetector } from '../interfaces/harvest-delay.interface';
import type { LifecycleContext, WeatherContext, ActivityContext, HarvestDelay } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestDelayDetectorEngine implements IHarvestDelayDetector {
  detectDelay(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
    activities: ActivityContext,
  ) {
    const reasons: string[] = [];
    const actions: string[] = [];
    let delayDays = 0;

    if (weather.hasFloodRisk) { delayDays += 7; reasons.push('Flood conditions detected'); actions.push('Delay harvest until flood recedes'); }
    if ((weather.forecastRainProbability ?? 0) > 80) { delayDays += 3; reasons.push('Heavy rainfall probability > 80%'); actions.push('Monitor forecast — harvest in dry window'); }
    if (weather.hasHeatStress) { delayDays += 2; reasons.push('Heat stress may affect grain maturity'); actions.push('Irrigate and monitor crop stress signs'); }
    if (activities.hasLateIrrigation) { delayDays += 3; reasons.push('Late irrigation detected — crop stress extended'); actions.push('Complete irrigation schedule immediately'); }
    if (activities.hasLateFertilizer) { delayDays += 2; reasons.push('Late fertilizer application — delayed maturity'); actions.push('Complete fertilizer schedule'); }
    if (lifecycle.lifecycleStage === 'overdue') { reasons.push('Crop has passed optimal harvest window'); actions.push('Harvest immediately to prevent further loss'); }

    let explanation = '';
    if (delayDays > 0) {
      explanation = `Harvest delayed by ${delayDays} days due to: ${reasons.join(', ')}`;
    }
    return { hasDelay: delayDays > 0, delayDays, delayReasons: reasons, suggestedActions: actions, explanation };
  }
}
