import { DataSource } from 'typeorm';
import { WeatherMongoService } from '../mongodb/weather/weather-mongo.service';
import { WeatherApiService } from './weather-api.service';
import { CurrentWeatherResponse, ForecastResponse, WeatherHistoryResponse } from './interfaces/weather-response.interface';
export declare class WeatherService {
    private readonly dataSource;
    private readonly weatherMongoService;
    private readonly weatherApiService;
    private readonly logger;
    constructor(dataSource: DataSource, weatherMongoService: WeatherMongoService, weatherApiService: WeatherApiService);
    getCurrentWeather(parcelId: string, userId: string): Promise<CurrentWeatherResponse>;
    getForecast(parcelId: string, userId: string): Promise<ForecastResponse>;
    getWeatherHistory(parcelId: string, userId: string, startDate?: Date, endDate?: Date): Promise<WeatherHistoryResponse>;
    private getParcelWithOwnershipCheck;
    private buildLocationId;
    private isCacheValid;
    private isForecastCacheValid;
}
