import type { IMarketRawRecord, MarketFetchParams } from '../../market/interfaces/market.interface';

/**
 * IMarketDataSource
 *
 * Abstraction over any market data provider.
 * Phase 9 ships with MockMarketDataSource.
 * AGMARKNET plugs in by implementing this interface — zero architecture changes.
 */
export interface IMarketDataSource {
  /** Unique name of this data source */
  readonly sourceName: string;

  /**
   * Fetch raw market price records.
   * Returns an empty array if the source is unavailable.
   */
  fetchPrices(params: MarketFetchParams): Promise<IMarketRawRecord[]>;

  /** Whether this source is currently reachable */
  isAvailable(): Promise<boolean>;
}
