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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const weather_service_1 = require("./weather.service");
const get_weather_dto_1 = require("./dto/get-weather.dto");
let WeatherController = class WeatherController {
    weatherService;
    constructor(weatherService) {
        this.weatherService = weatherService;
    }
    async getCurrentWeather(parcelId, req) {
        return this.weatherService.getCurrentWeather(parcelId, req.user.id);
    }
    async getForecast(parcelId, req) {
        return this.weatherService.getForecast(parcelId, req.user.id);
    }
    async getWeatherHistory(parcelId, query, req) {
        const startDate = query.startDate ? new Date(query.startDate) : undefined;
        const endDate = query.endDate ? new Date(query.endDate) : undefined;
        return this.weatherService.getWeatherHistory(parcelId, req.user.id, startDate, endDate);
    }
};
exports.WeatherController = WeatherController;
__decorate([
    (0, common_1.Get)('current/:parcelId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current weather for a land parcel',
        description: 'Returns the current weather for the GPS location of the specified land parcel. ' +
            'Data is served from MongoDB cache (30-minute TTL) or fetched live from OpenWeather API.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'parcelId',
        description: 'ID of the land parcel',
        example: '3',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Current weather returned successfully.',
        schema: {
            example: {
                locationId: '12.9716_77.5946',
                parcelId: '3',
                district: 'Bengaluru',
                state: '',
                country: 'IN',
                latitude: 12.9716,
                longitude: 77.5946,
                timestamp: '2024-06-25T09:00:00.000Z',
                temperature: 27.5,
                feelsLike: 29.0,
                humidity: 68,
                rainfall: 0,
                windSpeed: 3.2,
                pressure: 1012,
                weatherCondition: 'Clouds',
                weatherDescription: 'scattered clouds',
                weatherIcon: '03d',
                visibility: 10000,
                source: 'openweather',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized — missing or invalid JWT.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden — parcel does not belong to this user.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Land parcel not found or no GPS coordinates set.' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'OpenWeather API is unavailable.' }),
    __param(0, (0, common_1.Param)('parcelId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getCurrentWeather", null);
__decorate([
    (0, common_1.Get)('forecast/:parcelId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get 5-day weather forecast for a land parcel',
        description: 'Returns a 5-day / 3-hour weather forecast for the parcel location. ' +
            'Data is cached in MongoDB for 3 hours before refreshing from OpenWeather.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'parcelId',
        description: 'ID of the land parcel',
        example: '3',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Forecast returned successfully.',
        schema: {
            example: {
                locationId: '12.9716_77.5946',
                parcelId: '3',
                latitude: 12.9716,
                longitude: 77.5946,
                source: 'cache',
                forecasts: [
                    {
                        forecastDate: '2024-06-26T00:00:00.000Z',
                        temperature: 25.0,
                        feelsLike: 26.5,
                        humidity: 72,
                        rainProbability: 40,
                        windSpeed: 2.8,
                        weatherCondition: 'Rain',
                        weatherDescription: 'light rain',
                        weatherIcon: '10d',
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parcel not found.' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'OpenWeather API unavailable.' }),
    __param(0, (0, common_1.Param)('parcelId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getForecast", null);
__decorate([
    (0, common_1.Get)('history/:parcelId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get historical weather for a land parcel',
        description: 'Returns stored historical weather records from MongoDB for the parcel location. ' +
            'Defaults to the last 7 days if no date range is provided.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'parcelId',
        description: 'ID of the land parcel',
        example: '3',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        required: false,
        description: 'Start date (ISO 8601)',
        example: '2024-06-01T00:00:00.000Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        required: false,
        description: 'End date (ISO 8601)',
        example: '2024-06-25T23:59:59.999Z',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Historical weather returned successfully.',
        schema: {
            example: {
                locationId: '12.9716_77.5946',
                parcelId: '3',
                startDate: '2024-06-18T00:00:00.000Z',
                endDate: '2024-06-25T00:00:00.000Z',
                history: [
                    {
                        timestamp: '2024-06-20T12:00:00.000Z',
                        temperature: 28.3,
                        humidity: 65,
                        rainfall: 2.1,
                        windSpeed: 4.0,
                        pressure: 1010,
                        weatherCondition: 'Rain',
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parcel not found.' }),
    __param(0, (0, common_1.Param)('parcelId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_weather_dto_1.GetWeatherHistoryDto, Object]),
    __metadata("design:returntype", Promise)
], WeatherController.prototype, "getWeatherHistory", null);
exports.WeatherController = WeatherController = __decorate([
    (0, swagger_1.ApiTags)('Weather'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('weather'),
    __metadata("design:paramtypes", [weather_service_1.WeatherService])
], WeatherController);
//# sourceMappingURL=weather.controller.js.map