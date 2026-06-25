import { WeatherService } from './weather.service';
import { GetWeatherHistoryDto } from './dto/get-weather.dto';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getCurrentWeather(parcelId: string, req: any): Promise<import("./interfaces/weather-response.interface").CurrentWeatherResponse>;
    getForecast(parcelId: string, req: any): Promise<import("./interfaces/weather-response.interface").ForecastResponse>;
    getWeatherHistory(parcelId: string, query: GetWeatherHistoryDto, req: any): Promise<import("./interfaces/weather-response.interface").WeatherHistoryResponse>;
}
