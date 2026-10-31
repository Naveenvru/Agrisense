import { Injectable } from '@nestjs/common';
import { BaseHttpClient } from '../../integrations/common/base-http.client';
import { INTEGRATION_CONSTANTS } from '../../integrations/common/integration.constants';
import { CacheService } from '../../integrations/common/cache.service';
import { IMarketDataSource } from './market-data-source.interface';
import { IMarketRawRecord, MarketFetchParams } from '../../market/interfaces/market.interface';

interface MandiApiRecord {
  state?: string;
  district?: string;
  market?: string;
  commodity?: string;
  variety?: string | null;
  grade?: string | null;
  arrival_date?: string;
  min_price?: string | number | null;
  max_price?: string | number | null;
  modal_price?: string | number | null;
  fetched_at?: string;
  [key: string]: unknown;
}

interface MandiApiResponse {
  success?: boolean;
  data?: MandiApiRecord[];
  meta?: { count?: number };
}

/** Adapter for the externally hosted Mandi Price API. It does not fall back to synthetic data. */
@Injectable()
export class MandiApiDataSource implements IMarketDataSource {
  readonly sourceName = INTEGRATION_CONSTANTS.PROVIDERS.MANDI_API;
  private readonly baseUrl = (process.env.MANDI_API_BASE_URL ?? 'https://mandi-api.onrender.com/v1').replace(/\/$/, '');

  constructor(
    private readonly http: BaseHttpClient,
    private readonly cache: CacheService,
  ) {}

  async fetchPrices(params: MarketFetchParams): Promise<IMarketRawRecord[]> {
    const query: Record<string, string | number | boolean> = {};
    if (params.state) query.state = params.state;
    if (params.commodity) query.commodity = params.commodity;
    if (params.market) query.market = params.market;
    if (params.date) query.date = params.date.toISOString().slice(0, 10);

    const historical = Boolean(params.date && params.state && params.commodity);
    const endpoint = historical ? 'prices/history' : 'prices';
    if (historical && params.date) {
      const date = params.date.toISOString().slice(0, 10);
      delete query.date;
      query.from = date;
      query.to = date;
    }
    const cacheKey = `mandi-api:${endpoint}:${JSON.stringify(query)}`;
    const cached = this.cache.get<IMarketRawRecord[]>(cacheKey);
    if (cached) return params.limit ? cached.slice(0, params.limit) : cached;

    const { data } = await this.http.get<MandiApiResponse>(`${this.baseUrl}/${endpoint}`, { params: query });
    if (data?.success === false) throw new Error('Mandi API returned success=false.');
    if (!Array.isArray(data?.data)) throw new Error('Mandi API response did not contain a data array.');

    const collectedAt = new Date();
    const batchId = `mandi_api_${collectedAt.toISOString()}`;
    const mapped = data.data
      .filter((row) => !params.district || row.district?.toLocaleLowerCase() === params.district.toLocaleLowerCase())
      .map((row) => this.mapRecord(row, collectedAt, batchId))
      .filter((record): record is IMarketRawRecord => record !== null);

    this.cache.set(cacheKey, mapped, { ttlMs: 10 * 60 * 1000 });
    return params.limit ? mapped.slice(0, params.limit) : mapped;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const { data } = await this.http.get<{ success?: boolean; data?: unknown[] }>(`${this.baseUrl}/states`);
      return data?.success !== false && Array.isArray(data?.data);
    } catch {
      return false;
    }
  }

  private mapRecord(row: MandiApiRecord, collectedAt: Date, batchId: string): IMarketRawRecord | null {
    const minPrice = this.toNumber(row.min_price);
    const maxPrice = this.toNumber(row.max_price);
    const modalPrice = this.toNumber(row.modal_price);
    const date = row.arrival_date ? new Date(row.arrival_date) : null;
    if (!row.state || !row.district || !row.market || !row.commodity || !date || Number.isNaN(date.getTime()) || minPrice === null || maxPrice === null || modalPrice === null) {
      return null;
    }

    return {
      state: row.state,
      district: row.district,
      market: row.market,
      commodity: row.commodity,
      variety: row.variety ?? undefined,
      grade: row.grade ?? undefined,
      date,
      minPrice,
      maxPrice,
      modalPrice,
      // The provider's price API does not document arrival quantity. Do not fabricate it.
      unit: 'Quintal',
      source: this.sourceName,
      rawPayload: JSON.stringify(row),
      providerFetchedAt: this.parseDate(row.fetched_at),
      collectedAt,
      batchId,
    };
  }

  private toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === '') return null;
    const result = Number(value);
    return Number.isFinite(result) ? result : null;
  }

  private parseDate(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
}
