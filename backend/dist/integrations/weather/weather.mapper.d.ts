import { IWeatherHistory, IWeatherForecast } from '../../mongodb/interfaces/weather.interface';
import { OWCurrentWeatherResponse, OWForecastResponse } from './weather.types';
export declare class WeatherMapper {
    mapCurrentWeather(raw: OWCurrentWeatherResponse, latitude: number, longitude: number): IWeatherHistory;
    mapForecast(raw: OWForecastResponse, latitude: number, longitude: number): IWeatherForecast[];
    private buildLocationId;
}
