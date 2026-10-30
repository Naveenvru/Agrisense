import { apiClient } from '@/lib/axios';

export interface MarketPriceRecord {
  _id: string;
  commodity: string;
  market: string;
  district: string;
  state: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  source: string;
  normalizedAt?: string;
  updatedAt?: string;
}

export interface MarketQuery {
  commodity?: string;
  market?: string;
  district?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export class MarketService {
  static async getPrices(query: MarketQuery): Promise<MarketPriceRecord[]> {
    const { data } = await apiClient.get('/market/prices', { params: query });
    return data;
  }
}
