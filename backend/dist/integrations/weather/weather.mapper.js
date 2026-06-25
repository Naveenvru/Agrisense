"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherMapper = void 0;
const common_1 = require("@nestjs/common");
const integration_constants_1 = require("../common/integration.constants");
let WeatherMapper = class WeatherMapper {
    mapCurrentWeather(raw, latitude, longitude) {
        return {
            locationId: this.buildLocationId(latitude, longitude),
            district: raw.name || 'Unknown',
            state: '',
            country: raw.sys?.country || 'Unknown',
            latitude,
            longitude,
            timestamp: new Date(raw.dt * 1000),
            temperature: raw.main.temp,
            humidity: raw.main.humidity,
            rainfall: raw.rain?.['1h'] ?? raw.rain?.['3h'] ?? 0,
            windSpeed: raw.wind.speed,
            pressure: raw.main.pressure,
            weatherCondition: raw.weather[0]?.main || 'Unknown',
            source: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        };
    }
    mapForecast(raw, latitude, longitude) {
        const locationId = this.buildLocationId(latitude, longitude);
        return raw.list.map((item) => ({
            locationId,
            forecastDate: new Date(item.dt * 1000),
            temperature: item.main.temp,
            humidity: item.main.humidity,
            rainProbability: Math.round((item.pop ?? 0) * 100),
            windSpeed: item.wind.speed,
            weatherCondition: item.weather[0]?.main || 'Unknown',
            source: integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER,
        }));
    }
    buildLocationId(latitude, longitude) {
        return `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
    }
};
exports.WeatherMapper = WeatherMapper;
exports.WeatherMapper = WeatherMapper = __decorate([
    (0, common_1.Injectable)()
], WeatherMapper);
//# sourceMappingURL=weather.mapper.js.map