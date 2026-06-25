import { IIntegrationProvider } from '../common/provider.interface';

/**
 * IGovernmentProvider
 *
 * Contract for government data providers.
 * Future implementations: IMD (Indian Meteorological Dept), ICAR, Soil APIs.
 *
 * All government data clients must implement this interface.
 */
export interface IGovernmentProvider extends IIntegrationProvider {
  /**
   * Fetch government-sourced data for the given region and date range.
   *
   * @param region    State, district, or taluk identifier
   * @param startDate Start of the data range
   * @param endDate   End of the data range
   */
  fetchData(region: string, startDate: Date, endDate: Date): Promise<unknown>;
}
