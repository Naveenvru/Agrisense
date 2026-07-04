import { YieldIntelligenceService } from './yield-intelligence.service';

describe('YieldIntelligenceService', () => {
  it('returns the authenticated user assessments list', async () => {
    const service = new YieldIntelligenceService(
      { query: jest.fn().mockResolvedValue([{ id: '99' }]) } as any,
      { getCurrentWeather: jest.fn(), getWeatherHistory: jest.fn() } as any,
      { findAll: jest.fn() } as any,
      { resolveLocation: jest.fn() } as any,
      { compute: jest.fn() } as any,
      { evaluate: jest.fn() } as any,
      { findByFarmerCropId: jest.fn(), findByFarmerProfileId: jest.fn().mockResolvedValue([]), findHistory: jest.fn() } as any,
      { publishPredicted: jest.fn(), publishUpdated: jest.fn(), publishReduced: jest.fn(), publishWarning: jest.fn(), publishCompleted: jest.fn() } as any,
      { getRegionalSummary: jest.fn() } as any,
      { refreshGlobalAnalytics: jest.fn(), getAnalytics: jest.fn().mockResolvedValue([]) } as any,
      { estimate: jest.fn() } as any,
    );

    const assessments = await service.getMyAssessments('55');

    expect(assessments).toEqual([]);
  });
});
