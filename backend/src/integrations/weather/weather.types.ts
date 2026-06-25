/**
 * weather.types.ts
 *
 * All OpenWeather API raw response shapes live here.
 * These are the types that weather.mapper.ts reads from.
 *
 * NOTE: These are intentionally separate from the AgriSense internal
 * interfaces (IWeatherHistory / IWeatherForecast) stored in MongoDB.
 * The mapper is the only bridge between these two type worlds.
 */

export interface OWWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface OWMainMetrics {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface OWWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface OWRain {
  '1h'?: number;
  '3h'?: number;
}

export interface OWCurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: OWWeatherCondition[];
  main: OWMainMetrics;
  visibility: number;
  wind: OWWind;
  rain?: OWRain;
  clouds: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  name: string;
}

export interface OWForecastItem {
  dt: number;
  main: OWMainMetrics;
  weather: OWWeatherCondition[];
  wind: OWWind;
  rain?: { '3h'?: number };
  clouds: { all: number };
  /** Probability of precipitation (0–1) */
  pop: number;
  dt_txt: string;
}

export interface OWForecastResponse {
  list: OWForecastItem[];
  city: {
    name: string;
    country: string;
    coord: { lat: number; lon: number };
  };
}

/** Params passed from OpenWeatherClient to BaseHttpClient */
export interface OpenWeatherFetchParams {
  latitude: number;
  longitude: number;
}
