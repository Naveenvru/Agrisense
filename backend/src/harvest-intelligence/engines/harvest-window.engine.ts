import { Injectable } from '@nestjs/common';
import type { IHarvestWindowCalculator } from '../interfaces/harvest-window.interface';
import type { LifecycleContext, WeatherContext, HarvestWindow } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestWindowCalculatorEngine implements IHarvestWindowCalculator {
  calculateWindow(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
  ): HarvestWindow {
    const harvestDate = lifecycle.expectedHarvestDate ?? new Date();
    const earliest = new Date(harvestDate);
    earliest.setDate(earliest.getDate() - 5);

    const latest = new Date(harvestDate);
    latest.setDate(latest.getDate() + 10);

    let windowDays = 15;
    const explanation: string[] = ['Harvest window: earliest 5 days before expected date'];
    
    if (weather.hasFloodRisk || (weather.forecastRainProbability ?? 0) > 70) {
      earliest.setDate(harvestDate.getDate() - 2);
      latest.setDate(harvestDate.getDate() + 3);
      windowDays = 5;
      explanation.push('Window tightened due to flood/rain risk — harvest promptly');
    }

    return {
      earliestHarvestDate: earliest,
      optimalHarvestDate: harvestDate,
      latestSafeHarvestDate: latest,
      windowDays,
      explanation: explanation.join('; '),
    };
  }
}
