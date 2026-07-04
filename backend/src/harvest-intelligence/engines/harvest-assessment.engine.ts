import { Injectable } from '@nestjs/common';
import type { IHarvestAssessmentStrategy, IHarvestAssessmentResult } from '../interfaces/harvest-assessment.interface';
import type { LifecycleContext, WeatherContext, ActivityContext, ReadinessStatus } from '../interfaces/harvest-intelligence.types';
import { HarvestRiskAnalyzerEngine } from './harvest-risk-analyzer.engine';
import { HarvestScoreCalculatorEngine } from './harvest-score-calculator.engine';
import { HarvestConfidenceCalculatorEngine } from './harvest-confidence-calculator.engine';
import { HarvestDelayDetectorEngine } from './harvest-delay-detector.engine';
import { HarvestWindowCalculatorEngine } from './harvest-window.engine';

@Injectable()
export class HarvestAssessmentEngine implements IHarvestAssessmentStrategy {
  constructor(
    private readonly riskAnalyzer: HarvestRiskAnalyzerEngine,
    private readonly scoreCalculator: HarvestScoreCalculatorEngine,
    private readonly confidenceCalculator: HarvestConfidenceCalculatorEngine,
    private readonly delayDetector: HarvestDelayDetectorEngine,
    private readonly windowCalculator: HarvestWindowCalculatorEngine,
  ) {}

  evaluate(
    lifecycle: LifecycleContext,
    weather: WeatherContext,
    activities: ActivityContext,
    cropTemperatureMin: number | null,
    cropTemperatureMax: number | null,
  ): IHarvestAssessmentResult {
    const explanations: string[] = [];

    // 1. Readiness Score
    const readinessScore = this.computeReadinessScore(lifecycle, explanations);
    const readinessStatus = this.resolveReadinessStatus(lifecycle, readinessScore);

    // 2. Risk Assessment
    const risk = this.riskAnalyzer.analyzeRisk(weather, activities);
    explanations.push(risk.explanation);

    // 3. Harvest Window
    const harvestWindow = this.windowCalculator.calculateWindow(lifecycle, weather);
    explanations.push(harvestWindow.explanation);

    // 4. Delay Detection
    const harvestDelay = this.delayDetector.detectDelay(lifecycle, weather, activities);
    if (harvestDelay.explanation) explanations.push(harvestDelay.explanation);

    // 5. Harvest Score
    const scoreResult = this.scoreCalculator.calculateScore(
      readinessScore,
      risk.riskPoints,
      activities.completionRate,
      weather,
      lifecycle,
      cropTemperatureMin,
      cropTemperatureMax,
    );
    explanations.push(scoreResult.explanation);

    // 6. Confidence Score
    const confResult = this.confidenceCalculator.calculateConfidence(lifecycle, weather, activities);
    explanations.push(confResult.explanation);

    return {
      readinessScore,
      readinessStatus,
      harvestScore: scoreResult.score,
      confidenceScore: confResult.confidence,
      riskLevel: risk.riskLevel,
      riskFactors: risk.riskFactors,
      mitigationRecommendations: risk.mitigations,
      harvestWindow,
      harvestDelay,
      explanations,
    };
  }

  private computeReadinessScore(lifecycle: LifecycleContext, explanations: string[]): number {
    const { growthPercentage, lifecycleStage, daysRemaining } = lifecycle;
    let score = 0;

    switch (lifecycleStage) {
      case 'pre-sowing':   score = 0; break;
      case 'seedling':     score = Math.round(growthPercentage * 0.3); break;
      case 'vegetative':   score = Math.round(growthPercentage * 0.6); break;
      case 'reproductive': score = Math.round(growthPercentage * 0.8); break;
      case 'ripening':     score = Math.round(growthPercentage * 0.95); break;
      case 'ready':        score = 95 + Math.min(5, daysRemaining === 0 ? 5 : 0); break;
      case 'overdue':      score = Math.max(60, 100 - (growthPercentage - 100)); break;
      case 'harvested':    score = 100; break;
      default:             score = 0;
    }

    score = Math.min(100, Math.max(0, score));
    explanations.push(`Crop is at ${growthPercentage}% growth (stage: ${lifecycleStage}) — readiness: ${score}%`);
    if (daysRemaining > 0) {
      explanations.push(`${daysRemaining} days remaining until expected harvest`);
    } else if (lifecycleStage !== 'harvested') {
      explanations.push('Crop has passed expected harvest date — harvest urgently');
    }
    return score;
  }

  private resolveReadinessStatus(lifecycle: LifecycleContext, score: number): ReadinessStatus {
    if (lifecycle.lifecycleStage === 'harvested') return 'harvested';
    if (score >= 90) return 'ready';
    if (score >= 70) return 'almost-ready';
    if (score >= 30) return 'developing';
    return 'not-ready';
  }
}
