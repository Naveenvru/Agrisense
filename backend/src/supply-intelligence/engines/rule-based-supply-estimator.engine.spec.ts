import { RuleBasedSupplyEstimatorEngine } from './rule-based-supply-estimator.engine';
import { SupplyRiskAnalyzerEngine } from './supply-risk-analyzer.engine';
import { SupplyConfidenceCalculatorEngine } from './supply-confidence-calculator.engine';
import { SupplyRecommendationEngine } from './supply-recommendation.engine';

const baseContext = {
  farmerCropId: '1',
  farmerProfileId: '10',
  cropName: 'Paddy',
  cropVariety: 'Hybrid Gold',
  cropCategory: 'grain',
  regionLevel: 'district',
  regionName: 'Bengaluru Urban',
  villageName: 'Sample Village',
  talukName: 'Sample Taluk',
  districtName: 'Bengaluru Urban',
  stateName: 'Karnataka',
  areaAcres: 2,
  expectedHarvestDate: new Date('2026-08-29'),
  harvestStage: 'vegetative',
  harvestReadinessScore: 55,
  harvestRiskLevel: 'low',
  harvestExplanations: ['Harvest is progressing normally'],
  yieldExpectedKg: 5200,
  yieldConfidence: 78,
  yieldRiskLevel: 'low',
  yieldExplanations: ['Yield outlook is stable'],
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
  lifecycle: {
    sowingDate: new Date('2026-05-01'),
    durationDays: 120,
    expectedHarvestDate: new Date('2026-08-29'),
    daysElapsed: 45,
    daysRemaining: 75,
    growthPercentage: 38,
    lifecycleStage: 'vegetative',
  },
  historicalSupplyKg: [5000, 5150, 5200],
  actualYieldKg: null,
  regionalEventNotes: [],
} as const;

describe('RuleBasedSupplyEstimatorEngine', () => {
  it('produces an explainable supply prediction', () => {
    const engine = new RuleBasedSupplyEstimatorEngine(
      new SupplyRiskAnalyzerEngine(),
      new SupplyConfidenceCalculatorEngine(),
      new SupplyRecommendationEngine(),
    );

    const result = engine.estimate(baseContext as any);

    expect(result.expectedSupplyKg).toBeGreaterThan(0);
    expect(result.availableSupplyKg).toBeGreaterThan(0);
    expect(result.availableSupplyKg).toBeLessThanOrEqual(result.expectedSupplyKg);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.explanations.length).toBeGreaterThan(0);
    expect(result.timeline.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.risk.level).toBeDefined();
  });

  it('reduces supply confidence and increases risk under stress', () => {
    const engine = new RuleBasedSupplyEstimatorEngine(
      new SupplyRiskAnalyzerEngine(),
      new SupplyConfidenceCalculatorEngine(),
      new SupplyRecommendationEngine(),
    );

    const stressedResult = engine.estimate({
      ...baseContext,
      weather: {
        ...baseContext.weather,
        currentTemperature: 41,
        currentRainfall: 55,
        hasHeatStress: true,
        hasFloodRisk: true,
        weatherCondition: 'storm heavy rain',
      },
      harvestStage: 'delayed',
      harvestReadinessScore: 30,
      harvestRiskLevel: 'critical',
      yieldRiskLevel: 'critical',
      yieldConfidence: 42,
      regionalEventNotes: ['Road access affected by rainfall'],
    } as any);

    expect(['high', 'critical']).toContain(stressedResult.risk.level);
    expect(stressedResult.confidence).toBeLessThan(80);
    expect(stressedResult.availableSupplyKg).toBeLessThan(stressedResult.expectedSupplyKg);
    expect(stressedResult.risk.reasons.length).toBeGreaterThan(0);
    expect(stressedResult.recommendations.length).toBeGreaterThan(0);
  });
});