export interface IWeatherHistory {
    locationId: string;
    district: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    weatherCondition: string;
    source: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IWeatherForecast {
    locationId: string;
    forecastDate: Date;
    temperature: number;
    humidity: number;
    rainProbability: number;
    windSpeed: number;
    weatherCondition: string;
    source: string;
    createdAt?: Date;
    updatedAt?: Date;
}
