import { SupplyIntelligenceService } from './supply-intelligence.service';

describe('SupplyIntelligenceService', () => {
  it('assembles and persists a supply assessment', async () => {
    const resultTemplate = {
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
      expectedSupplyKg: 6000,
      availableSupplyKg: 5400,
      supplyDensityKgPerAcre: 3000,
      confidence: 82,
      confidenceBand: 'high',
      explanation: 'Expected supply remains strong.',
      explanations: ['Base supply benchmark is strong'],
      risk: {
        level: 'medium',
        score: 28,
        reasons: ['Normal crop flow'],
        mitigationRecommendations: ['Maintain current plan'],
        explanation: 'Supply risk is medium.',
      },
      seasonalAnalysis: {
        currentSeasonSupplyKg: 5400,
        nextSeasonSupplyKg: 3900,
        monthlySupply: { '2026-07': 5400 },
        weeklySupply: { week1: 1000 },
        cropWiseSeasonalDistribution: { Paddy: 5400 },
        explanation: 'Seasonal supply outlook is stable.',
      },
      timeline: [
        { label: 'today', date: new Date('2026-07-04'), expectedSupplyKg: 900, availableSupplyKg: 800, explanation: 'Current day supply is limited.' },
      ],
      recommendations: [
        { action: 'Maintain current supply plan', expectedImpact: 'Preserves current output', confidence: 65, priority: 3, explanation: 'No action needed.' },
      ],
      harvestStage: 'vegetative',
      yieldStage: 'low',
      weatherSummary: 'clear sky',
      assessedAt: new Date('2026-07-04'),
      version: 1,
    };

    const service = new SupplyIntelligenceService(
      {
        query: jest.fn().mockImplementation((sql: string) => {
          if (sql.includes('SELECT id FROM farmer_profiles')) return Promise.resolve([{ id: '10' }]);
          if (sql.includes('WHERE fc.id = $1')) {
            return Promise.resolve([
              {
                id: '1',
                sowing_date: '2026-05-01',
                expected_harvest_date: '2026-08-29',
                estimated_yield_kg: 5200,
                actual_yield_kg: null,
                status: 'active',
                crop_variety: 'Hybrid Gold',
                parcel_id: '99',
                crop_id: '5',
                crop_name: 'Paddy',
                crop_category: 'grain',
                season: 'kharif',
                duration_days: 120,
                ideal_temperature_min: 20,
                ideal_temperature_max: 34,
                water_requirement: 'medium',
                area_acres: 2,
                soil_type: 'loam',
                land_type: 'irrigated',
                irrigation_type: 'drip',
                additional_metadata: {},
                longitude: 77.59,
                latitude: 12.97,
                farmer_profile_id: '10',
                user_id: '55',
                district: 'Bengaluru Urban',
                state: 'Karnataka',
                village: 'Sample Village',
                total_land_area: 2,
                primary_soil_type: 'loam',
                primary_irrigation_type: 'drip',
              },
            ]);
          }
          if (sql.includes('WHERE fc.status = \'active\'')) {
            return Promise.resolve([{ farmer_crop_id: '1', user_id: '55' }]);
          }
          return Promise.resolve([]);
        }),
      } as any,
      { getCurrentWeather: jest.fn().mockResolvedValue({ temperature: 29, humidity: 65, rainfall: 5, weatherCondition: 'clear sky' }), getWeatherHistory: jest.fn().mockResolvedValue({ history: [] }) } as any,
      { findAll: jest.fn().mockResolvedValue([]) } as any,
      { resolveLocation: jest.fn().mockResolvedValue({ villageName: 'Sample Village', talukName: 'Sample Taluk', districtName: 'Bengaluru Urban', stateName: 'Karnataka', provider: 'mock', resolvedAt: new Date() }) } as any,
      { findByFarmerCropId: jest.fn().mockResolvedValue({ optimalHarvestDate: new Date('2026-08-29'), readinessScore: 70, riskLevel: 'low', readinessStatus: 'ready', explanations: ['Harvest is progressing normally'] }) } as any,
      { findByFarmerCropId: jest.fn().mockResolvedValue({ expectedYieldKg: 5200, confidence: 78, risk: { level: 'low' }, explanations: ['Yield outlook is stable'], historicalYieldSamples: [5000, 5150] }) } as any,
      {
        findByFarmerCropId: jest.fn().mockResolvedValueOnce(null).mockResolvedValue(resultTemplate),
        upsertAssessment: jest.fn(),
        appendHistory: jest.fn(),
        findByFarmerProfileId: jest.fn().mockResolvedValue([resultTemplate]),
        findHistory: jest.fn().mockResolvedValue([]),
        findAllPredictions: jest.fn().mockResolvedValue([resultTemplate]),
        upsertAnalytics: jest.fn(),
        findAnalytics: jest.fn().mockResolvedValue([]),
      } as any,
      { publishPredicted: jest.fn(), publishUpdated: jest.fn(), publishWarning: jest.fn(), publishCompleted: jest.fn() } as any,
      { getRegionalSummary: jest.fn().mockResolvedValue({ regionLevel: 'district', regionName: 'Bengaluru Urban' }) } as any,
      { refreshGlobalAnalytics: jest.fn().mockResolvedValue(resultTemplate as any), refreshRegionalAnalytics: jest.fn().mockResolvedValue(undefined), getAnalytics: jest.fn().mockResolvedValue([]) } as any,
      { estimate: jest.fn().mockReturnValue(resultTemplate) } as any,
    );

    const assessment = await service.assess('1', '55');

    expect(assessment.availableSupplyKg).toBeGreaterThan(0);
    expect(assessment.recommendations.length).toBeGreaterThan(0);

    const risk = await service.getRisk('1', '55');
    expect(risk.riskLevel).toBe('medium');
    expect(risk.reasons.length).toBeGreaterThan(0);
  });
});