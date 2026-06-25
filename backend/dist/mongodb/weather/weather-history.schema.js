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
exports.WeatherHistorySchema = exports.WeatherHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let WeatherHistory = class WeatherHistory {
    locationId;
    district;
    state;
    country;
    latitude;
    longitude;
    timestamp;
    temperature;
    humidity;
    rainfall;
    windSpeed;
    pressure;
    weatherCondition;
    source;
};
exports.WeatherHistory = WeatherHistory;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], WeatherHistory.prototype, "locationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', index: true }),
    __metadata("design:type", String)
], WeatherHistory.prototype, "district", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], WeatherHistory.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherHistory.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherHistory.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherHistory.prototype, "longitude", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", Date)
], WeatherHistory.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherHistory.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherHistory.prototype, "humidity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherHistory.prototype, "rainfall", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherHistory.prototype, "windSpeed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherHistory.prototype, "pressure", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherHistory.prototype, "weatherCondition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherHistory.prototype, "source", void 0);
exports.WeatherHistory = WeatherHistory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'weather_history' })
], WeatherHistory);
exports.WeatherHistorySchema = mongoose_1.SchemaFactory.createForClass(WeatherHistory);
//# sourceMappingURL=weather-history.schema.js.map