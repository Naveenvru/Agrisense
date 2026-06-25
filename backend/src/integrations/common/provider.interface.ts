import { ProviderHealthResult } from './integration.types';

/**
 * IIntegrationProvider
 *
 * The root interface that every external service provider in AgriSense must
 * implement. Enforces a consistent contract across OpenWeather, AGMARKNET,
 * IMD, ICAR, eNAM, and all future providers.
 *
 * Usage:
 *   @Injectable()
 *   export class OpenWeatherClient implements IIntegrationProvider { ... }
 */
export interface IIntegrationProvider {
  /**
   * Fetch data from the external provider.
   * The generic parameter T defines the shape of the returned data.
   *
   * @param params  Provider-specific parameters (coordinates, date range, etc.)
   * @returns       Parsed and provider-specific raw response
   */
  fetch<T = unknown>(params: Record<string, unknown>): Promise<T>;

  /**
   * Authenticate with the provider if required.
   * For API-key based providers this may be a no-op.
   * For OAuth / token-refresh flows it will refresh the bearer token.
   */
  authenticate(): Promise<void>;

  /**
   * Perform a lightweight health check against the provider.
   * Used by monitoring dashboards and startup checks.
   */
  health(): Promise<ProviderHealthResult>;
}
