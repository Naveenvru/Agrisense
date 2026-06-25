import { IMarketProvider } from '../provider/market-provider.interface';
import { ProviderHealthResult } from '../../common/integration.types';
import { INTEGRATION_CONSTANTS } from '../../common/integration.constants';

/**
 * AgmarknetClient — STUB (Phase 9)
 *
 * Will implement live AGMARKNET API calls in the Market Price Module phase.
 * Stub is here to validate the architecture compiles end-to-end.
 *
 * DO NOT add business logic here until Phase 9.
 */
export class AgmarknetClient implements IMarketProvider {
  async fetch<T = unknown>(_params: Record<string, unknown>): Promise<T> {
    throw new Error('AgmarknetClient: not yet implemented (Phase 9).');
  }

  async authenticate(): Promise<void> {
    // No-op for now
  }

  async health(): Promise<ProviderHealthResult> {
    return {
      provider: INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
      healthy: false,
      message: 'AgmarknetClient is not yet implemented (Phase 9).',
      checkedAt: new Date(),
    };
  }

  async fetchPrices(
    _crop: string,
    _market: string,
    _date: Date,
  ): Promise<unknown> {
    throw new Error('AgmarknetClient.fetchPrices: not yet implemented (Phase 9).');
  }
}
