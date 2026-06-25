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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherForecastSchema = exports.WeatherForecast = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let WeatherForecast = class WeatherForecast {
    locationId;
    forecastDate;
    temperature;
    humidity;
    rainProbability;
    windSpeed;
    weatherCondition;
    source;
};
exports.WeatherForecast = WeatherForecast;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], WeatherForecast.prototype, "locationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], WeatherForecast.prototype, "forecastDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherForecast.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherForecast.prototype, "humidity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherForecast.prototype, "rainProbability", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherForecast.prototype, "windSpeed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherForecast.prototype, "weatherCondition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherForecast.prototype, "source", void 0);
exports.WeatherForecast = WeatherForecast = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'weather_forecast' })
], WeatherForecast);
exports.WeatherForecastSchema = mongoose_1.SchemaFactory.createForClass(WeatherForecast);
//# sourceMappingURL=weather-forecast.schema.js.map