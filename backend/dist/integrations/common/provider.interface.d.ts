import { ProviderHealthResult } from './integration.types';
export interface IIntegrationProvider {
    fetch<T = unknown>(params: Record<string, unknown>): Promise<T>;
    authenticate(): Promise<void>;
    health(): Promise<ProviderHealthResult>;
}
