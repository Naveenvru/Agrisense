"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var WeatherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const weather_mongo_service_1 = require("../mongodb/weather/weather-mongo.service");
const weather_api_service_1 = require("./weather-api.service");
const CURRENT_WEATHER_TTL_MINUTES = 30;
const FORECAST_TTL_HOURS = 3;
let WeatherService = WeatherService_1 = class WeatherService {
    dataSource;
    weatherMongoService;
    weatherApiService;
    logger = new common_1.Logger(WeatherService_1.name);
    constructor(dataSource, weatherMongoService, weatherApiService) {
        this.dataSource = dataSource;
        this.weatherMongoService = weatherMongoService;
        this.weatherApiService = weatherApiService;
    }
    async getCurrentWeather(parcelId, userId) {
        const parcel = await this.getParcelWithOwnershipCheck(parcelId, userId);
        const { latitude, longitude } = parcel;
        const locationId = this.buildLocationId(latitude, longitude);
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
                feelsLike: cached.feelsLike ?? cached.temperature,
                humidity: cached.humidity,
                rainfall: cached.rainfall,
                windSpeed: cached.windSpeed,
                pressure: cached.pressure,
                weatherCondition: cached.weatherCondition,
                weatherDescription: cached.weatherDescription ?? cached.weatherCondition,
                weatherIcon: cached.weatherIcon ?? '',
                visibility: cached.visibility ?? 0,
                source: 'cache',
                cachedAt: cached.timestamp,
            };
        }
        this.logger.log(`Cache MISS for current weather | locationId=${locationId}. Calling OpenWeather API...`);
        const weatherData = await this.weatherApiService.fetchCurrentWeather(latitude, longitude);
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
            feelsLike: weatherData.feelsLike ?? weatherData.temperature,
            humidity: weatherData.humidity,
            rainfall: weatherData.rainfall,
            windSpeed: weatherData.windSpeed,
            pressure: weatherData.pressure,
            weatherCondition: weatherData.weatherCondition,
            weatherDescription: weatherData.weatherDescription ?? weatherData.weatherCondition,
            weatherIcon: weatherData.weatherIcon ?? '',
            visibility: weatherData.visibility ?? 0,
            source: 'openweather',
        };
    }
    async getForecast(parcelId, userId) {
        const parcel = await this.getParcelWithOwnershipCheck(parcelId, userId);
        const { latitude, longitude } = parcel;
        const locationId = this.buildLocationId(latitude, longitude);
        const now = new Date();
        const cachedForecasts = await this.weatherMongoService.getForecast(locationId, now);
        if (cachedForecasts.length > 0 && this.isForecastCacheValid(cachedForecasts[0]['createdAt'] ?? now, FORECAST_TTL_HOURS)) {
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
                    feelsLike: f.feelsLike ?? f.temperature,
                    humidity: f.humidity,
                    rainProbability: f.rainProbability,
                    windSpeed: f.windSpeed,
                    weatherCondition: f.weatherCondition,
                    weatherDescription: f.weatherDescription ?? f.weatherCondition,
                    weatherIcon: f.weatherIcon ?? '',
                })),
            };
        }
        this.logger.log(`Cache MISS for forecast | locationId=${locationId}. Calling OpenWeather API...`);
        const forecastData = await this.weatherApiService.fetchForecast(latitude, longitude);
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
                feelsLike: f.feelsLike ?? f.temperature,
                humidity: f.humidity,
                rainProbability: f.rainProbability,
                windSpeed: f.windSpeed,
                weatherCondition: f.weatherCondition,
                weatherDescription: f.weatherDescription ?? f.weatherCondition,
                weatherIcon: f.weatherIcon ?? '',
            })),
        };
    }
    async getWeatherHistory(parcelId, userId, startDate, endDate) {
        const parcel = await this.getParcelWithOwnershipCheck(parcelId, userId);
        const { latitude, longitude } = parcel;
        const locationId = this.buildLocationId(latitude, longitude);
        const start = startDate ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
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
    async getParcelWithOwnershipCheck(parcelId, userId) {
        const profileRows = await this.dataSource.query(`SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
        if (!profileRows.length) {
            throw new common_1.NotFoundException('Farmer profile not found. Please create a farmer profile first.');
        }
        const farmerProfileId = profileRows[0].id;
        const parcelRows = await this.dataSource.query(`SELECT
         id,
         farmer_profile_id AS "farmerProfileId",
         ST_Y(COALESCE(location, centroid)::geometry) AS "latitude",
         ST_X(COALESCE(location, centroid)::geometry) AS "longitude"
       FROM farmer_land_parcels
       WHERE id = $1`, [parcelId]);
        if (!parcelRows.length) {
            throw new common_1.NotFoundException('Land parcel not found.');
        }
        const parcel = parcelRows[0];
        if (parcel.farmerProfileId !== farmerProfileId) {
            throw new common_1.ForbiddenException('You do not have permission to access this land parcel.');
        }
        if (parcel.latitude === null || parcel.longitude === null) {
            throw new common_1.NotFoundException('This land parcel has no registered coordinate or boundary centroid. Add a map location or farm boundary first.');
        }
        return {
            latitude: parseFloat(parcel.latitude),
            longitude: parseFloat(parcel.longitude),
        };
    }
    buildLocationId(latitude, longitude) {
        return `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
    }
    isCacheValid(timestamp, ttlMinutes) {
        const expiresAt = new Date(timestamp.getTime() + ttlMinutes * 60 * 1000);
        return new Date() < expiresAt;
    }
    isForecastCacheValid(createdAt, ttlHours) {
        const expiresAt = new Date(createdAt.getTime() + ttlHours * 60 * 60 * 1000);
        return new Date() < expiresAt;
    }
};
exports.WeatherService = WeatherService;
exports.WeatherService = WeatherService = WeatherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        weather_mongo_service_1.WeatherMongoService,
        weather_api_service_1.WeatherApiService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map