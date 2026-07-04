import type { IHarvestAssessmentStrategy, IHarvestAssessmentResult } from '../interfaces/harvest-assessment.interface';
import type { LifecycleContext, WeatherContext, ActivityContext } from '../interfaces/harvest-intelligence.types';
import { HarvestRiskAnalyzerEngine } from './harvest-risk-analyzer.engine';
import { HarvestScoreCalculatorEngine } from './harvest-score-calculator.engine';
import { HarvestConfidenceCalculatorEngine } from './harvest-confidence-calculator.engine';
import { HarvestDelayDetectorEngine } from './harvest-delay-detector.engine';
import { HarvestWindowCalculatorEngine } from './harvest-window.engine';
export declare class HarvestAssessmentEngine implements IHarvestAssessmentStrategy {
    private readonly riskAnalyzer;
    private readonly scoreCalculator;
    private readonly confidenceCalculator;
    private readonly delayDetector;
    private readonly windowCalculator;
    constructor(riskAnalyzer: HarvestRiskAnalyzerEngine, scoreCalculator: HarvestScoreCalculatorEngine, confidenceCalculator: HarvestConfidenceCalculatorEngine, delayDetector: HarvestDelayDetectorEngine, windowCalculator: HarvestWindowCalculatorEngine);
    evaluate(lifecycle: LifecycleContext, weather: WeatherContext, activities: ActivityContext, cropTemperatureMin: number | null, cropTemperatureMax: number | null): IHarvestAssessmentResult;
    private computeReadinessScore;
    private resolveReadinessStatus;
}
