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
var WeatherMongoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherMongoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const weather_history_schema_1 = require("./weather-history.schema");
const weather_forecast_schema_1 = require("./weather-forecast.schema");
let WeatherMongoService = WeatherMongoService_1 = class WeatherMongoService {
    weatherHistoryModel;
    weatherForecastModel;
    logger = new common_1.Logger(WeatherMongoService_1.name);
    constructor(weatherHistoryModel, weatherForecastModel) {
        this.weatherHistoryModel = weatherHistoryModel;
        this.weatherForecastModel = weatherForecastModel;
    }
    async saveWeather(weatherData) {
        const newWeather = new this.weatherHistoryModel(weatherData);
        return newWeather.save();
    }
    async getLatestWeather(locationId) {
        return this.weatherHistoryModel
            .findOne({ locationId })
            .sort({ timestamp: -1 })
            .exec();
    }
    async getWeatherHistory(locationId, startDate, endDate) {
        return this.weatherHistoryModel
            .find({
            locationId,
            timestamp: { $gte: startDate, $lte: endDate },
        })
            .sort({ timestamp: 1 })
            .exec();
    }
    async deleteOldWeather(olderThanDate) {
        return this.weatherHistoryModel.deleteMany({
            timestamp: { $lt: olderThanDate },
        }).exec();
    }
    async saveForecast(forecastData) {
        const newForecast = new this.weatherForecastModel(forecastData);
        return newForecast.save();
    }
    async getForecast(locationId, startDate) {
        return this.weatherForecastModel.find({
            locationId,
            forecastDate: { $gte: startDate }
        })
            .sort({ forecastDate: 1 })
            .exec();
    }
};
exports.WeatherMongoService = WeatherMongoService;
exports.WeatherMongoService = WeatherMongoService = WeatherMongoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weather_history_schema_1.WeatherHistory.name)),
    __param(1, (0, mongoose_1.InjectModel)(weather_forecast_schema_1.WeatherForecast.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WeatherMongoService);
//# sourceMappingURL=weather-mongo.service.js.map