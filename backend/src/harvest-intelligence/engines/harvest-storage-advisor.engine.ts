import { Injectable } from '@nestjs/common';
import type { IHarvestStorageAdvisor } from '../interfaces/harvest-storage.interface';
import type { WeatherContext, LifecycleContext, StorageAdvice } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestStorageAdvisorEngine implements IHarvestStorageAdvisor {
  recommendStorage(
    qualityGrade: string,
    lifecycle: LifecycleContext,
    weather: WeatherContext,
  ): StorageAdvice {
    if (lifecycle.lifecycleStage === 'overdue' || qualityGrade === 'C') {
      return {
        recommendation: 'immediate-sale',
        explanation: 'Grade C quality or over-mature crop — sell immediately to minimise losses',
      };
    }
    if (weather.hasFloodRisk || (weather.forecastRainProbability ?? 0) > 70) {
      return {
        recommendation: 'temporary-storage',
        explanation: 'Flood/rain risk detected — move to covered temporary storage until weather clears',
      };
    }
    if (qualityGrade === 'A') {
      return {
        recommendation: 'cold-storage',
        explanation: 'Grade A quality crop — cold storage preserves premium quality for better market timing',
      };
    }
    return {
      recommendation: 'warehouse',
      explanation: 'Grade B quality — warehouse storage suitable; sell within 30 days',
    };
  }
}
