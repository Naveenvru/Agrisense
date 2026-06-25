import { IIntegrationProvider } from '../../common/provider.interface';

/**
 * IMarketProvider
 *
 * Contract for market price data providers.
 * Implementations: AgmarknetClient, eNamClient (future phases)
 *
 * All market data providers must implement this interface so that
 * MarketPriceService can swap providers without changing business code.
 */
export interface IMarketProvider extends IIntegrationProvider {
  /**
   * Fetch commodity prices for the given market and date.
   *
   * @param crop     Commodity name (e.g. 'Wheat', 'Rice')
   * @param market   Market name or APMC code
   * @param date     Date for which prices are requested
   */
  fetchPrices(crop: string, market: string, date: Date): Promise<unknown>;
}
