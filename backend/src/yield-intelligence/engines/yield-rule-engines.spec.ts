import { YieldRiskAnalyzerEngine } from './yield-risk-analyzer.engine';
import { YieldConfidenceCalculatorEngine } from './yield-confidence-calculator.engine';
import { YieldQualityAssessorEngine } from './yield-quality-assessor.engine';
import { YieldLossEstimatorEngine } from './yield-loss-estimator.engine';
import { YieldRecommendationEngineImpl } from './yield-recommendation.engine';

const baseContext = {
  farmerCropId: '1',
  farmerProfileId: '10',
  cropName: 'Paddy',
  cropVariety: 'Hybrid Gold',
  cropCategory: 'grain',
  areaAcres: 2,
  soilType: 'loam',
  soilFertilityScore: 78,
  irrigationType: 'drip',
  lifecycle: {
    sowingDate: new Date('2026-05-01'),
    durationDays: 120,
    expectedHarvestDate: new Date('2026-08-29'),
    daysElapsed: 45,
    daysRemaining: 75,
    growthPercentage: 38,
    lifecycleStage: 'vegetative',
  },
  weather: {
    currentTemperature: 29,
    currentHumidity: 65,
    currentRainfall: 5,
    forecastRainProbability: 20,
    forecastTemperature: 30,
    weatherCondition: 'clear sky',
    hasRainForecast: false,
    hasHeatStress: false,
    hasColdStress: false,
    hasFloodRisk: false,
  },
  weatherHistory: [
    { timestamp: new Date('2026-06-01'), temperature: 28, humidity: 62, rainfall: 4, weatherCondition: 'clear' },
    { timestamp: new Date('2026-06-02'), temperature: 29, humidity: 63, rainfall: 5, weatherCondition: 'clear' },
  ],
  activities: {
    totalEvents: 4,
    completedEvents: 4,
    pendingEvents: 0,
    overduePendingEvents: 0,
    completionRate: 100,
    hasLateIrrigation: false,
    hasLateFertilizer: false,
    hasMissedActivities: false,
  },
  readinessScore: 55,
  riskLevelEquivalent: 'low',
  historicalYieldKg: 5200,
  historicalYieldSamples: [5000, 5300, 5150],
  cropTemperatureMin: 20,
  cropTemperatureMax: 34,
  actualYieldKg: null,
} as const;

describe('Yield rule engines', () => {
  it('produces risk, confidence, quality, loss, and recommendations with explanations', () => {
    const riskAnalyzer = new YieldRiskAnalyzerEngine();
    const confidenceCalculator = new YieldConfidenceCalculatorEngine();
    const qualityAssessor = new YieldQualityAssessorEngine();
    const lossEstimator = new YieldLossEstimatorEngine();
    const recommendationEngine = new YieldRecommendationEngineImpl();

    const risk = riskAnalyzer.analyze(baseContext as any);
    const confidence = confidenceCalculator.calculate(baseContext as any, 2500);
    const quality = qualityAssessor.assess(baseContext as any, 2500, confidence.confidence);
    const loss = lossEstimator.estimate(baseContext as any, 5000, risk.score);
    const recommendations = recommendationEngine.recommend(baseContext as any, risk, loss, confidence);

    expect(risk.level).toBe('low');
    expect(risk.score).toBeLessThan(25);
    expect(risk.explanation).toContain('Yield risk is low');

    expect(['high', 'very-high', 'medium']).toContain(confidence.band);
    expect(confidence.confidence).toBeGreaterThan(0);
    expect(confidence.explanation).toContain('Yield confidence is');

    expect(['A', 'B']).toContain(quality.grade);
    expect(quality.score).toBeGreaterThan(0);
    expect(quality.explanation).toContain('Yield quality is graded');

    expect(loss.expectedLossPercent).toBeGreaterThanOrEqual(0);
    expect(loss.expectedLossQuantityKg).toBeGreaterThanOrEqual(0);
    expect(loss.explanation).toContain('Expected yield loss is');

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].action).toBeTruthy();
    expect(recommendations[0].explanation).toBeTruthy();
  });

  it('escalates risk and loss when weather and activities are unfavorable', () => {
    const riskAnalyzer = new YieldRiskAnalyzerEngine();
    const confidenceCalculator = new YieldConfidenceCalculatorEngine();
    const lossEstimator = new YieldLossEstimatorEngine();

    const stressedContext = {
      ...baseContext,
      weather: {
        ...baseContext.weather,
        currentTemperature: 41,
        currentRainfall: 58,
        hasHeatStress: true,
        hasFloodRisk: true,
        weatherCondition: 'storm heavy rain',
      },
      activities: {
        ...baseContext.activities,
        completionRate: 42,
        hasLateIrrigation: true,
        hasLateFertilizer: true,
        hasMissedActivities: true,
      },
      soilFertilityScore: 38,
      readinessScore: 22,
    };

    const risk = riskAnalyzer.analyze(stressedContext as any);
    const confidence = confidenceCalculator.calculate(stressedContext as any, 1600);
    const loss = lossEstimator.estimate(stressedContext as any, 4200, risk.score);

    expect(['high', 'critical']).toContain(risk.level);
    expect(risk.reasons.length).toBeGreaterThan(0);
    expect(['low', 'medium']).toContain(confidence.band);
    expect(confidence.reasons.length).toBeGreaterThan(0);
    expect(loss.expectedLossPercent).toBeGreaterThan(0);
    expect(loss.reasons.length).toBeGreaterThan(0);
  });
});