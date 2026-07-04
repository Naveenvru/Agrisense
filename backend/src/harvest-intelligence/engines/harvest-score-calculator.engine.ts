import { Injectable } from '@nestjs/common';
import type { IHarvestScoreCalculator } from '../interfaces/harvest-score.interface';
import type { WeatherContext, LifecycleContext } from '../interfaces/harvest-intelligence.types';

@Injectable()
export class HarvestScoreCalculatorEngine implements IHarvestScoreCalculator {
  calculateScore(
    readinessScore: number,
    riskPoints: number,
    completionRate: number,
    weather: WeatherContext,
    lifecycle: LifecycleContext,
    tempMin: number | null,
    tempMax: number | null,
  ) {
    let score = readinessScore * 0.4;
    score += Math.max(0, (100 - riskPoints)) * 0.25;
    score += completionRate * 0.20;

    let weatherScore = 70;
    if (weather.hasFloodRisk) weatherScore -= 30;
    if (weather.hasHeatStress) weatherScore -= 15;
    if (weather.hasColdStress) weatherScore -= 10;
    score += Math.max(0, weatherScore) * 0.15;

    const finalScore = Math.min(100, Math.max(0, Math.round(score)));
    const explanation = `Harvest score ${finalScore}/100: readiness(40%) + risk(25%) + activities(20%) + weather(15%)`;
    return { score: finalScore, explanation };
  }
}
