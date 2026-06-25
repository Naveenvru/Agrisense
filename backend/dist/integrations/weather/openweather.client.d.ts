import { ConfigService } from '@nestjs/config';
import { IWeatherHistory, IWeatherForecast } from '../../mongodb/interfaces/weather.interface';
import { IIntegrationProvider } from '../common/provider.interface';
import { ProviderHealthResult } from '../common/integration.types';
import { BaseHttpClient } from '../common/base-http.client';
import { WeatherMapper } from './weather.mapper';
export declare class OpenWeatherClient implements IIntegrationProvider {
    private readonly configService;
    private readonly httpClient;
    private readonly mapper;
    private readonly logger;
    private readonly apiKey;
    private readonly baseUrl;
    constructor(configService: ConfigService, httpClient: BaseHttpClient, mapper: WeatherMapper);
    fetch<T = unknown>(params: Record<string, unknown>): Promise<T>;
    authenticate(): Promise<void>;
    health(): Promise<ProviderHealthResult>;
    fetchCurrentWeather(latitude: number, longitude: number): Promise<IWeatherHistory>;
    fetchForecast(latitude: number, longitude: number): Promise<IWeatherForecast[]>;
}
