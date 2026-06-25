import { IIntegrationProvider } from './provider.interface';
import { ProviderHealthResult } from './integration.types';
import { ProviderName } from './integration.constants';
export declare class IntegrationRegistry {
    private readonly logger;
    private readonly providers;
    register(name: ProviderName | string, provider: IIntegrationProvider): void;
    get(name: ProviderName | string): IIntegrationProvider | undefined;
    getAll(): ReadonlyMap<string, IIntegrationProvider>;
    getRegisteredNames(): string[];
    isRegistered(name: string): boolean;
    healthCheckAll(): Promise<ProviderHealthResult[]>;
}
