import { IWeatherHistory, IWeatherForecast } from '../mongodb/interfaces/weather.interface';
import { OpenWeatherClient } from '../integrations/weather/openweather.client';
export declare class WeatherApiService {
    private readonly openWeatherClient;
    constructor(openWeatherClient: OpenWeatherClient);
    fetchCurrentWeather(latitude: number, longitude: number): Promise<IWeatherHistory>;
    fetchForecast(latitude: number, longitude: number): Promise<IWeatherForecast[]>;
}
