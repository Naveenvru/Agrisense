import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { WeatherMongoService } from '../mongodb/weather/weather-mongo.service';
import { WeatherApiService } from './weather-api.service';
import {
  CurrentWeatherResponse,
  ForecastResponse,
  WeatherHistoryResponse,
} from './interfaces/weather-response.interface';

// Cache TTL constants
const CURRENT_WEATHER_TTL_MINUTES = 30;
const FORECAST_TTL_HOURS = 3;

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly weatherMongoService: WeatherMongoService,
    private readonly weatherApiService: WeatherApiService,
  ) {}

  // ---------------------------------------------------------------------------
  // GET CURRENT WEATHER
  // ---------------------------------------------------------------------------

  async getCurrentWeather(
    parcelId: string,
    userId: string,
  ): Promise<CurrentWeatherResponse> {
    const parcel = await this.getParcelWithOwnershipCheck(parcelId, userId);
    const { latitude, longitude } = parcel;
    const locationId = this.buildLocationId(latitude, longitude);

    // 1. Check MongoDB cache
    const cached = await this.weatherMongoService.getLatestWeather(locationId);

    if (cached && this.isCacheValid(cached.timestamp, CURRENT_WEATHER_TTL_MINUTES)) {
      this.logger.log(`Cache HIT for current weather | locationId=${locationId}`);
      return {
        locationId,
        parcelId,
        district: cached.district,
        state: cached.state,
        country: cached.country,
        latitude: cached.latitude,
        longitude: cached.longitude,
        timestamp: cached.timestamp,
        temperature: cached.temperature,
        feelsLike: (cached as any).feelsLike ?? cached.temperature,
        humidity: cached.humidity,
        rainfall: cached.rainfall,
        windSpeed: cached.windSpeed,
        pressure: cached.pressure,
        weatherCondition: cached.weatherCondition,
        weatherDescription: (cached as any).weatherDescription ?? cached.weatherCondition,
        weatherIcon: (cached as any).weatherIcon ?? '',
        visibility: (cached as any).visibility ?? 0,
        source: 'cache',
        cachedAt: cached.timestamp,
      };
    }

    // 2. Cache MISS — call OpenWeather API
    this.logger.log(`Cache MISS for current weather | locationId=${locationId}. Calling OpenWeather API...`);
    const weatherData = await this.weatherApiService.fetchCurrentWeather(latitude, longitude);

    // 3. Store in MongoDB
    await this.weatherMongoService.saveWeather({
      ...weatherData,
      locationId,
    });

    this.logger.log(`Saved new weather record to MongoDB | locationId=${locationId}`);

    return {
      locationId,
      parcelId,
      district: weatherData.district,
      state: weatherData.state,
      country: weatherData.country,
      latitude: weatherData.latitude,
      longitude: weatherData.longitude,
      timestamp: weatherData.timestamp,
      temperature: weatherData.temperature,
      feelsLike: (weatherData as any).feelsLike ?? weatherData.temperature,
      humidity: weatherData.humidity,
      rainfall: weatherData.rainfall,
      windSpeed: weatherData.windSpeed,
      pressure: weatherData.pressure,
      weatherCondition: weatherData.weatherCondition,
      weatherDescription: (weatherData as any).weatherDescription ?? weatherData.weatherCondition,
      weatherIcon: (weatherData as any).weatherIcon ?? '',
      visibility: (weatherData as any).visibility ?? 0,
      source: 'openweather',
    };
  }

  // ---------------------------------------------------------------------------
  // GET FORECAST
  // ---------------------------------------------------------------------------

  async getForecast(
    parcelId: string,
    userId: string,
  ): Promise<ForecastResponse> {
    const parcel = await this.getParcelWithOwnershipCheck(parcelId, userId);
    const { latitude, longitude } = parcel;
    const locationId = this.buildLocationId(latitude, longitude);

    // 1. Check MongoDB cache for forecasts from now onwards
    const now = new Date();
    const cachedForecasts = await this.weatherMongoService.getForecast(locationId, now);

    if (cachedForecasts.length > 0 && this.isForecastCacheValid((cachedForecasts[0] as any)['createdAt'] ?? now, FORECAST_TTL_HOURS)) {
      this.logger.log(`Cache HIT for forecast | locationId=${locationId}`);
      return {
        locationId,
        parcelId,
        latitude,
        longitude,
        source: 'cache',
        forecasts: cachedForecasts.map((f) => ({
          forecastDate: f.forecastDate,
          temperature: f.temperature,
          feelsLike: (f as any).feelsLike ?? f.temperature,
          humidity: f.humidity,
          rainProbability: f.rainProbability,
          windSpeed: f.windSpeed,
          weatherCondition: f.weatherCondition,
          weatherDescription: (f as any).weatherDescription ?? f.weatherCondition,
          weatherIcon: (f as any).weatherIcon ?? '',
        })),
      };
    }

    // 2. Cache MISS — fetch from OpenWeather
    this.logger.log(`Cache MISS for forecast | locationId=${locationId}. Calling OpenWeather API...`);
    const forecastData = await this.weatherApiService.fetchForecast(latitude, longitude);

    // 3. Store each forecast item in MongoDB
    for (const item of forecastData) {
      await this.weatherMongoService.saveForecast({ ...item, locationId });
    }

    this.logger.log(`Saved ${forecastData.length} forecast records to MongoDB | locationId=${locationId}`);

    return {
      locationId,
      parcelId,
      latitude,
      longitude,
      source: 'openweather',
      forecasts: forecastData.map((f) => ({
        forecastDate: f.forecastDate,
        temperature: f.temperature,
        feelsLike: (f as any).feelsLike ?? f.temperature,
        humidity: f.humidity,
        rainProbability: f.rainProbability,
        windSpeed: f.windSpeed,
        weatherCondition: f.weatherCondition,
        weatherDescription: (f as any).weatherDescription ?? f.weatherCondition,
        weatherIcon: (f as any).weatherIcon ?? '',
      })),
    };
  }

  // ---------------------------------------------------------------------------
  // GET WEATHER HISTORY
  // ---------------------------------------------------------------------------

  async getWeatherHistory(
    parcelId: string,
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<WeatherHistoryResponse> {
    const parcel = await this.getParcelWithOwnershipCheck(parcelId, userId);
    const { latitude, longitude } = parcel;
    const locationId = this.buildLocationId(latitude, longitude);

    const start = startDate ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // default: last 7 days
    const end = endDate ?? new Date();

    const history = await this.weatherMongoService.getWeatherHistory(locationId, start, end);

    return {
      locationId,
      parcelId,
      startDate: start,
      endDate: end,
      history: history.map((h) => ({
        timestamp: h.timestamp,
        temperature: h.temperature,
        humidity: h.humidity,
        rainfall: h.rainfall,
        windSpeed: h.windSpeed,
        pressure: h.pressure,
        weatherCondition: h.weatherCondition,
      })),
    };
  }

  // ---------------------------------------------------------------------------
  // Private utilities
  // ---------------------------------------------------------------------------

  private async getParcelWithOwnershipCheck(
    parcelId: string,
    userId: string,
  ): Promise<{ latitude: number; longitude: number }> {
    // 1. Resolve the farmer_profile_id for this user
    const profileRows = await this.dataSource.query(
      `SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`,
      [userId],
    );

    if (!profileRows.length) {
      throw new NotFoundException(
        'Farmer profile not found. Please create a farmer profile first.',
      );
    }

    const farmerProfileId = profileRows[0].id;

    // 2. Load parcel with PostGIS coordinates, enforce ownership
    const parcelRows = await this.dataSource.query(
      `SELECT
         id,
         farmer_profile_id AS "farmerProfileId",
         ST_Y(location::geometry) AS "latitude",
         ST_X(location::geometry) AS "longitude"
       FROM farmer_land_parcels
       WHERE id = $1`,
      [parcelId],
    );

    if (!parcelRows.length) {
      throw new NotFoundException('Land parcel not found.');
    }

    const parcel = parcelRows[0];

    if (parcel.farmerProfileId !== farmerProfileId) {
      throw new ForbiddenException(
        'You do not have permission to access this land parcel.',
      );
    }

    if (parcel.latitude === null || parcel.longitude === null) {
      throw new NotFoundException(
        'This land parcel does not have GPS coordinates. Please update the parcel with latitude and longitude.',
      );
    }

    return {
      latitude: parseFloat(parcel.latitude),
      longitude: parseFloat(parcel.longitude),
    };
  }

  private buildLocationId(latitude: number, longitude: number): string {
    return `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
  }

  private isCacheValid(timestamp: Date, ttlMinutes: number): boolean {
    const expiresAt = new Date(timestamp.getTime() + ttlMinutes * 60 * 1000);
    return new Date() < expiresAt;
  }

  private isForecastCacheValid(createdAt: Date, ttlHours: number): boolean {
    const expiresAt = new Date(createdAt.getTime() + ttlHours * 60 * 60 * 1000);
    return new Date() < expiresAt;
  }
}
