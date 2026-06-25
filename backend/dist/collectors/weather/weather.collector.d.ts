import { IWeatherHistory, IWeatherForecast } from '../../mongodb/interfaces/weather.interface';
import { OpenWeatherClient } from '../../integrations/weather/openweather.client';
import { CollectorLogger } from '../common/collector-logger.service';
import { ICollector } from '../common/collector.interface';
import { CollectionParams, CollectionResult, CollectorStatus } from '../common/collector.types';
export declare class WeatherCollector implements ICollector {
    private readonly openWeatherClient;
    private readonly collectorLogger;
    private readonly logger;
    private totalCollections;
    private successCount;
    private failureCount;
    private lastSuccessAt?;
    private lastFailureAt?;
    constructor(openWeatherClient: OpenWeatherClient, collectorLogger: CollectorLogger);
    collect(params: CollectionParams): Promise<CollectionResult<IWeatherHistory | IWeatherForecast[]>>;
    store(result: CollectionResult): Promise<void>;
    status(): CollectorStatus;
}
