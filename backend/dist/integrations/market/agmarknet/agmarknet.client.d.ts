import { IMarketProvider } from '../provider/market-provider.interface';
import { ProviderHealthResult } from '../../common/integration.types';
export declare class AgmarknetClient implements IMarketProvider {
    fetch<T = unknown>(_params: Record<string, unknown>): Promise<T>;
    authenticate(): Promise<void>;
    health(): Promise<ProviderHealthResult>;
    fetchPrices(_crop: string, _market: string, _date: Date): Promise<unknown>;
}
