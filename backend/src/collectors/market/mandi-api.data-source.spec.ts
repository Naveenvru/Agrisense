import { CacheService } from '../../integrations/common/cache.service';
import { BaseHttpClient } from '../../integrations/common/base-http.client';
import { MandiApiDataSource } from './mandi-api.data-source';
import { MarketNormalizationService } from '../../market/normalization/market-normalization.service';

describe('MandiApiDataSource', () => {
  it('maps provider price records and does not create arrival data when absent', async () => {
    const http = {
      get: jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: [{
            state: 'Karnataka', district: 'Hassan', market: 'Hassan', commodity: 'Onion',
            variety: 'Local', arrival_date: '2026-10-30', min_price: '1200', max_price: 1800,
            modal_price: '1500', fetched_at: '2026-10-30T18:00:00.000Z',
          }],
        },
      }),
    } as unknown as BaseHttpClient;
    const source = new MandiApiDataSource(http, new CacheService());

    const records = await source.fetchPrices({ state: 'Karnataka', commodity: 'Onion' });
    const normalized = new MarketNormalizationService().normalizeBatch(records);

    expect(http.get).toHaveBeenCalledWith(
      'https://mandi-api.onrender.com/v1/prices',
      { params: { state: 'Karnataka', commodity: 'Onion' } },
    );
    expect(records[0]).toMatchObject({
      state: 'Karnataka', district: 'Hassan', market: 'Hassan', commodity: 'Onion',
      variety: 'Local', minPrice: 1200, maxPrice: 1800, modalPrice: 1500,
      source: 'mandi_api',
    });
    expect(records[0].providerFetchedAt?.toISOString()).toBe('2026-10-30T18:00:00.000Z');
    expect(records[0].arrivalQty).toBeUndefined();
    expect(normalized.prices).toHaveLength(1);
    expect(normalized.arrivals).toHaveLength(0);
  });

  it('uses the documented history route for state, commodity, and date queries', async () => {
    const http = { get: jest.fn().mockResolvedValue({ data: { success: true, data: [] } }) } as unknown as BaseHttpClient;
    const source = new MandiApiDataSource(http, new CacheService());

    await source.fetchPrices({ state: 'Karnataka', commodity: 'Onion', market: 'Hassan', date: new Date('2026-10-30T12:00:00.000Z') });

    expect(http.get).toHaveBeenCalledWith(
      'https://mandi-api.onrender.com/v1/prices/history',
      { params: { state: 'Karnataka', commodity: 'Onion', market: 'Hassan', from: '2026-10-30', to: '2026-10-30' } },
    );
  });
});
