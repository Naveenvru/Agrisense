import { Model } from 'mongoose';
import { WeatherHistory, WeatherHistoryDocument } from './weather-history.schema';
import { WeatherForecast, WeatherForecastDocument } from './weather-forecast.schema';
import { IWeatherHistory, IWeatherForecast } from '../interfaces/weather.interface';
export declare class WeatherMongoService {
    private readonly weatherHistoryModel;
    private readonly weatherForecastModel;
    private readonly logger;
    constructor(weatherHistoryModel: Model<WeatherHistoryDocument>, weatherForecastModel: Model<WeatherForecastDocument>);
    saveWeather(weatherData: IWeatherHistory): Promise<WeatherHistory>;
    getLatestWeather(locationId: string): Promise<WeatherHistory | null>;
    getWeatherHistory(locationId: string, startDate: Date, endDate: Date): Promise<WeatherHistory[]>;
    deleteOldWeather(olderThanDate: Date): Promise<any>;
    saveForecast(forecastData: IWeatherForecast): Promise<WeatherForecast>;
    getForecast(locationId: string, startDate: Date): Promise<WeatherForecast[]>;
}
