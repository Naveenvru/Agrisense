import { OnModuleInit } from '@nestjs/common';
import { IntegrationRegistry } from './integration.registry';
import { OpenWeatherClient } from '../weather/openweather.client';
import { ProviderHealthResult } from './integration.types';
export declare class IntegrationHealthService implements OnModuleInit {
    private readonly registry;
    private readonly openWeatherClient;
    private readonly logger;
    constructor(registry: IntegrationRegistry, openWeatherClient: OpenWeatherClient);
    onModuleInit(): void;
    checkAll(): Promise<ProviderHealthResult[]>;
    checkOne(providerName: string): Promise<ProviderHealthResult>;
    getRegisteredProviders(): string[];
}
