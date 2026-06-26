import { Injectable } from '@nestjs/common';
import { IMarketDataSource } from './market-data-source.interface';
import { IMarketRawRecord, MarketFetchParams } from '../../market/interfaces/market.interface';
import { INTEGRATION_CONSTANTS } from '../../integrations/common/integration.constants';

/**
 * MockMarketDataSource
 *
 * Provides realistic synthetic market data for development and testing.
 * Mirrors AGMARKNET response structure so AGMARKNET can replace it with
 * zero architecture changes.
 *
 * When AGMARKNET API is available:
 *   1. Create AgmarknetDataSource implements IMarketDataSource
 *   2. Inject it into MarketCollector instead of MockMarketDataSource
 *   3. Zero changes to MarketCollector, normalization, or quality services
 */
@Injectable()
export class MockMarketDataSource implements IMarketDataSource {
  readonly sourceName = INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET;

  /** Realistic crop prices representative of Indian APMC markets (₹/Quintal) */
  private static readonly SAMPLE_DATA: Array<{
    commodity: string;
    variety: string;
    market: string;
    district: string;
    state: string;
    unit: string;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    arrivalQty: number;
  }> = [
    { commodity: 'Rice', variety: 'Sona Masuri', market: 'Bengaluru APMC', district: 'Bengaluru Urban', state: 'Karnataka', unit: 'Quintal', minPrice: 2200, maxPrice: 2600, modalPrice: 2400, arrivalQty: 1200 },
    { commodity: 'Wheat', variety: 'Lokwan', market: 'Delhi Azadpur', district: 'North Delhi', state: 'Delhi', unit: 'Quintal', minPrice: 2100, maxPrice: 2400, modalPrice: 2250, arrivalQty: 850 },
    { commodity: 'Tomato', variety: 'Hybrid', market: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', unit: 'Quintal', minPrice: 600, maxPrice: 1200, modalPrice: 900, arrivalQty: 4500 },
    { commodity: 'Onion', variety: 'Red', market: 'Nashik APMC', district: 'Nashik', state: 'Maharashtra', unit: 'Quintal', minPrice: 800, maxPrice: 1600, modalPrice: 1200, arrivalQty: 6200 },
    { commodity: 'Potato', variety: 'Kufri Pukhraj', market: 'Agra Mandi', district: 'Agra', state: 'Uttar Pradesh', unit: 'Quintal', minPrice: 500, maxPrice: 900, modalPrice: 700, arrivalQty: 3100 },
    { commodity: 'Maize', variety: 'Hybrid', market: 'Gulbarga APMC', district: 'Kalaburagi', state: 'Karnataka', unit: 'Quintal', minPrice: 1800, maxPrice: 2100, modalPrice: 1950, arrivalQty: 2200 },
    { commodity: 'Tur Dal', variety: 'Local', market: 'Latur APMC', district: 'Latur', state: 'Maharashtra', unit: 'Quintal', minPrice: 6200, maxPrice: 7000, modalPrice: 6600, arrivalQty: 780 },
    { commodity: 'Soyabean', variety: 'Yellow', market: 'Indore Mandi', district: 'Indore', state: 'Madhya Pradesh', unit: 'Quintal', minPrice: 4400, maxPrice: 5200, modalPrice: 4800, arrivalQty: 1560 },
  ];

  async fetchPrices(params: MarketFetchParams): Promise<IMarketRawRecord[]> {
    const batchId = `mock_${Date.now()}`;
    const collectedAt = new Date();
    const priceDate = params.date ?? new Date();

    let data = MockMarketDataSource.SAMPLE_DATA;

    if (params.commodity) {
      const q = params.commodity.toLowerCase();
      data = data.filter((d) => d.commodity.toLowerCase().includes(q));
    }
    if (params.market) {
      const q = params.market.toLowerCase();
      data = data.filter((d) => d.market.toLowerCase().includes(q));
    }
    if (params.state) {
      const q = params.state.toLowerCase();
      data = data.filter((d) => d.state.toLowerCase().includes(q));
    }

    if (params.limit) {
      data = data.slice(0, params.limit);
    }

    // Add ±5% price variation to simulate live data
    return data.map((d) => ({
      commodity: d.commodity,
      variety: d.variety,
      market: d.market,
      district: d.district,
      state: d.state,
      date: priceDate,
      minPrice: this.vary(d.minPrice),
      maxPrice: this.vary(d.maxPrice),
      modalPrice: this.vary(d.modalPrice),
      arrivalQty: this.vary(d.arrivalQty),
      unit: d.unit,
      source: this.sourceName,
      rawPayload: JSON.stringify(d),
      collectedAt,
      batchId,
    }));
  }

  async isAvailable(): Promise<boolean> {
    // Mock source is always available
    return true;
  }

  private vary(value: number): number {
    const factor = 0.95 + Math.random() * 0.1; // ±5%
    return Math.round(value * factor);
  }
}
