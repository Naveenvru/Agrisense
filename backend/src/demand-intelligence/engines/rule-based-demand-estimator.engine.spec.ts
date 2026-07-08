import { RuleBasedDemandEstimatorEngine } from './rule-based-demand-estimator.engine';
import { DemandRiskAnalyzerEngine } from './demand-risk-analyzer.engine';
import { DemandConfidenceCalculatorEngine } from './demand-confidence-calculator.engine';
import { DemandRecommendationEngine } from './demand-recommendation.engine';

const baseContext = {
  farmerCropId: '1',
  farmerProfileId: '10',
  cropName: 'Paddy',
  cropVariety: 'Hybrid Gold',
  cropCategory: 'grain',
  cropSeason: 'kharif',
  regionLevel: 'district' as const,
  regionName: 'Bengaluru Urban',
  villageName: 'Sample Village',
  talukName: 'Sample Taluk',
  districtName: 'Bengaluru Urban',
  stateName: 'Karnataka',
  areaAcres: 2,
  expectedHarvestDate: new Date('2026-09-15'),
  harvestReadinessScore: 62,
  harvestRiskLevel: 'low',
  harvestStage: 'vegetative',
  yieldExpectedKg: 5200,
  yieldConfidence: 78,
  yieldRiskLevel: 'low',
  availableSupplyKg: 4800,
  expectedSupplyKg: 5200,
  supplyRiskLevel: 'low',
  supplyDensityKgPerAcre: 2400,
  marketModalPrice: 2400,
  marketMinPrice: 2200,
  marketMaxPrice: 2600,
  marketTrendDirection: 'stable' as const,
  recentArrivalQty: 4200,
  weather: {
    currentTemperature: 28,
    currentHumidity: 65,
    currentRainfall: 4,
    forecastRainProbability: 20,
    forecastTemperature: 29,
    weatherCondition: 'partly cloudy',
    hasRainForecast: false,
    hasHeatStress: false,
    hasColdStress: false,
    hasFloodRisk: false,
  },
  lifecycle: {
    sowingDate: new Date('2026-06-01'),
    durationDays: 120,
    expectedHarvestDate: new Date('2026-09-29'),
    daysElapsed: 45,
    daysRemaining: 75,
    growthPercentage: 38,
    lifecycleStage: 'vegetative' as const,
  },
  isMspCrop: true,
  isExportCrop: false,
  currentMonth: 8,
  historicalDemandKg: [4500, 4700, 4900],
  regionalEventNotes: [],
};

describe('RuleBasedDemandEstimatorEngine', () => {
  it('produces an explainable demand prediction with all channels', () => {
    const engine = new RuleBasedDemandEstimatorEngine(
      new DemandRiskAnalyzerEngine(),
      new DemandConfidenceCalculatorEngine(),
      new DemandRecommendationEngine(),
    );

    const result = engine.estimate(baseContext);

    expect(result.expectedDemandKg).toBeGreaterThan(0);
    expect(result.currentDemandKg).toBeGreaterThan(0);
    expect(result.currentDemandKg).toBeLessThanOrEqual(result.expectedDemandKg);
    expect(result.governmentProcurementKg).toBeGreaterThan(0); // MSP crop
    expect(result.retailDemandKg).toBeGreaterThan(0);
    expect(result.demandDensityKgPerAcre).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
    expect(result.explanations.length).toBeGreaterThan(0);
    expect(result.timeline.length).toBe(6);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.risk.level).toBeDefined();
    expect(result.seasonalAnalysis.currentSeasonDemandKg).toBeGreaterThan(0);
  });

  it('increases demand pressure and risk under supply shortage and price spike', () => {
    const engine = new RuleBasedDemandEstimatorEngine(
      new DemandRiskAnalyzerEngine(),
      new DemandConfidenceCalculatorEngine(),
      new DemandRecommendationEngine(),
    );

    const shortageResult = engine.estimate({
      ...baseContext,
      availableSupplyKg: 1200,
      expectedSupplyKg: 5200,
      marketTrendDirection: 'rising',
      marketMaxPrice: 3800,
      marketModalPrice: 3500,
      harvestReadinessScore: 32,
      yieldRiskLevel: 'critical',
      yieldConfidence: 38,
      weather: { ...baseContext.weather, hasFloodRisk: true, hasHeatStress: true },
      regionalEventNotes: ['Flooding reported on main access road'],
      currentMonth: 11,
    });

    expect(['high', 'critical']).toContain(shortageResult.risk.level);
    expect(shortageResult.expectedDemandKg).toBeGreaterThan(shortageResult.currentDemandKg);
    expect(shortageResult.risk.reasons.length).toBeGreaterThan(0);
    expect(shortageResult.recommendations.length).toBeGreaterThan(0);
    expect(shortageResult.festivalDemandKg).toBeGreaterThan(0); // Nov = Diwali
  });

  it('produces stable demand with full supply and stable market', () => {
    const engine = new RuleBasedDemandEstimatorEngine(
      new DemandRiskAnalyzerEngine(),
      new DemandConfidenceCalculatorEngine(),
      new DemandRecommendationEngine(),
    );

    const stableResult = engine.estimate({
      ...baseContext,
      availableSupplyKg: 5500,
      expectedSupplyKg: 5200,
      marketTrendDirection: 'stable',
      historicalDemandKg: [5100, 5200, 5050],
    });

    expect(['low', 'medium']).toContain(stableResult.risk.level);
    expect(stableResult.confidence).toBeGreaterThan(50);
    expect(stableResult.currentDemandKg).toBeLessThanOrEqual(stableResult.expectedDemandKg);
  });
});
