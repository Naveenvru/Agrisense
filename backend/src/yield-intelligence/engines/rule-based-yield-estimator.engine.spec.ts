import { RuleBasedYieldEstimatorEngine } from './rule-based-yield-estimator.engine';
import { YieldRiskAnalyzerEngine } from './yield-risk-analyzer.engine';
import { YieldConfidenceCalculatorEngine } from './yield-confidence-calculator.engine';
import { YieldQualityAssessorEngine } from './yield-quality-assessor.engine';
import { YieldLossEstimatorEngine } from './yield-loss-estimator.engine';
import { YieldRecommendationEngineImpl } from './yield-recommendation.engine';

describe('RuleBasedYieldEstimatorEngine', () => {
  it('produces an explainable rule-based yield prediction', () => {
    const engine = new RuleBasedYieldEstimatorEngine(
      new YieldRiskAnalyzerEngine(),
      new YieldConfidenceCalculatorEngine(),
      new YieldQualityAssessorEngine(),
      new YieldLossEstimatorEngine(),
      new YieldRecommendationEngineImpl(),
    );

    const result = engine.estimate({
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
      weatherHistory: [],
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
    });

    expect(result.expectedYieldKg).toBeGreaterThan(0);
    expect(result.expectedProductionKg).toBeGreaterThanOrEqual(result.expectedYieldKg);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.explanations.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.risk.level).toBeDefined();
  });
});
