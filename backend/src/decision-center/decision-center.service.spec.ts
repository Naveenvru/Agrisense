import { DecisionCenterService } from './decision-center.service';

describe('DecisionCenterService', () => {
  it('records market evidence and calculates observed change without prediction', async () => {
    const records = [
      { commodity: 'Tomato', market: 'Bengaluru APMC', district: 'Bengaluru Urban', state: 'Karnataka', date: new Date('2026-10-01'), minPrice: 100, modalPrice: 120, maxPrice: 140, unit: 'Quintal', source: 'agmarknet' },
      { commodity: 'Tomato', market: 'Bengaluru APMC', district: 'Bengaluru Urban', state: 'Karnataka', date: new Date('2026-10-10'), minPrice: 110, modalPrice: 132, maxPrice: 150, unit: 'Quintal', source: 'agmarknet' },
    ];
    const market = { getPricesForUser: jest.fn().mockResolvedValue(records) };
    const traceRepo = { create: jest.fn((value) => value), save: jest.fn(async (value) => value) };
    const service = new DecisionCenterService(traceRepo as any, market as any);
    const result: any = await service.analyze('5', 'Analyze tomato prices in Bengaluru over the last 30 days');
    expect(result.status).toBe('completed');
    expect(result.traceId).toBeTruthy();
    expect(result.comparisons[0].observedChangePercent).toBe(10);
    expect(result.limitations).toContain('This describes stored market observations and is not a future price prediction or a sell/hold recommendation.');
    expect(traceRepo.save).toHaveBeenCalledTimes(1);
  });

  it('returns no fabricated recommendation for unsupported questions', async () => {
    const traceRepo = { create: jest.fn((value) => value), save: jest.fn(async (value) => value) };
    const service = new DecisionCenterService(traceRepo as any, {} as any);
    const result: any = await service.analyze('5', 'Should I irrigate my field tomorrow?');
    expect(result.status).toBe('unsupported');
    expect(result.stages[0].status).toBe('unsupported');
    expect(result.answer).toContain('currently analyzes recorded market prices');
  });
});
