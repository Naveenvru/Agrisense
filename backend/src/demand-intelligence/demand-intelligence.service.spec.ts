import { RuleBasedDemandEstimatorEngine } from './engines/rule-based-demand-estimator.engine';
import { DemandRiskAnalyzerEngine } from './engines/demand-risk-analyzer.engine';
import { DemandConfidenceCalculatorEngine } from './engines/demand-confidence-calculator.engine';
import { DemandRecommendationEngine } from './engines/demand-recommendation.engine';

describe('DemandIntelligenceService – integration smoke test', () => {
  it('RuleBasedDemandEstimatorEngine produces a valid prediction for a paddy crop', () => {
    const engine = new RuleBasedDemandEstimatorEngine(
      new DemandRiskAnalyzerEngine(),
      new DemandConfidenceCalculatorEngine(),
      new DemandRecommendationEngine(),
    );

    const context = {
      farmerCropId: '1',
      farmerProfileId: '10',
      cropName: 'Paddy',
      cropVariety: 'IR64',
      cropCategory: 'grain',
      cropSeason: 'kharif',
      regionLevel: 'district' as const,
      regionName: 'Bengaluru Urban',
      villageName: 'Devanahalli',
      talukName: 'Devanahalli',
      districtName: 'Bengaluru Urban',
      stateName: 'Karnataka',
      areaAcres: 2,
      expectedHarvestDate: new Date('2026-09-20'),
      harvestReadinessScore: 58,
      harvestRiskLevel: 'low',
      harvestStage: 'vegetative',
      yieldExpectedKg: 5200,
      yieldConfidence: 75,
      yieldRiskLevel: 'low',
      availableSupplyKg: 4900,
      expectedSupplyKg: 5200,
      supplyRiskLevel: 'low',
      supplyDensityKgPerAcre: 2450,
      marketModalPrice: 2400,
      marketMinPrice: 2200,
      marketMaxPrice: 2600,
      marketTrendDirection: 'stable' as const,
      recentArrivalQty: 4000,
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
        daysElapsed: 50,
        daysRemaining: 70,
        growthPercentage: 42,
        lifecycleStage: 'vegetative' as const,
      },
      isMspCrop: true,
      isExportCrop: false,
      currentMonth: 8,
      historicalDemandKg: [4600, 4800, 4750],
      regionalEventNotes: [],
    };

    const result = engine.estimate(context);

    expect(result.currentDemandKg).toBeGreaterThan(0);
    expect(result.expectedDemandKg).toBeGreaterThan(0);
    expect(result.governmentProcurementKg).toBeGreaterThan(0);
    expect(result.retailDemandKg).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
    expect(result.explanations.length).toBeGreaterThan(0);
    expect(result.timeline).toHaveLength(6);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.seasonalAnalysis.currentSeasonDemandKg).toBeGreaterThan(0);
    expect(result.risk.level).toBeDefined();

    console.log(
      `[DemandIntelligenceService] Demand assessment complete | farmerCropId=1 current=${result.currentDemandKg}kg expected=${result.expectedDemandKg}kg confidence=${result.confidence}% risk=${result.risk.level}`,
    );
  });
});
