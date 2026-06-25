export interface CurrentWeatherResponse {
    locationId: string;
    parcelId: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
    temperature: number;
    feelsLike: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    weatherCondition: string;
    weatherDescription: string;
    weatherIcon: string;
    visibility: number;
    source: 'cache' | 'openweather';
    cachedAt?: Date;
}
export interface ForecastItem {
    forecastDate: Date;
    temperature: number;
    feelsLike: number;
    humidity: number;
    rainProbability: number;
    windSpeed: number;
    weatherCondition: string;
    weatherDescription: string;
    weatherIcon: string;
}
export interface ForecastResponse {
    locationId: string;
    parcelId: string;
    latitude: number;
    longitude: number;
    forecasts: ForecastItem[];
    source: 'cache' | 'openweather';
}
export interface WeatherHistoryResponse {
    locationId: string;
    parcelId: string;
    startDate: Date;
    endDate: Date;
    history: Array<{
        timestamp: Date;
        temperature: number;
        humidity: number;
        rainfall: number;
        windSpeed: number;
        pressure: number;
        weatherCondition: string;
    }>;
}
