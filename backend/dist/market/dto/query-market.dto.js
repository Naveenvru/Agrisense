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
exports.PriceStatsDto = exports.QueryTrendsDto = exports.QueryMarketDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class QueryMarketDto {
    commodity;
    market;
    startDate;
    endDate;
    limit;
}
exports.QueryMarketDto = QueryMarketDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Commodity name filter', example: 'Rice' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMarketDto.prototype, "commodity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Market name filter', example: 'Bengaluru APMC' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryMarketDto.prototype, "market", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date (ISO 8601)', example: '2026-06-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryMarketDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date (ISO 8601)', example: '2026-06-26' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QueryMarketDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum results (1–500)', example: 100, default: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(500),
    __metadata("design:type", Number)
], QueryMarketDto.prototype, "limit", void 0);
class QueryTrendsDto extends QueryMarketDto {
    period;
}
exports.QueryTrendsDto = QueryTrendsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Trend period', enum: ['daily', 'weekly', 'monthly'], example: 'weekly' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['daily', 'weekly', 'monthly']),
    __metadata("design:type", String)
], QueryTrendsDto.prototype, "period", void 0);
class PriceStatsDto {
    commodity;
    market;
    startDate;
    endDate;
}
exports.PriceStatsDto = PriceStatsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Commodity name', example: 'Rice' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PriceStatsDto.prototype, "commodity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Market name', example: 'Bengaluru APMC' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PriceStatsDto.prototype, "market", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Start date (ISO 8601)', example: '2026-06-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PriceStatsDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End date (ISO 8601)', example: '2026-06-26' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PriceStatsDto.prototype, "endDate", void 0);
//# sourceMappingURL=query-market.dto.js.map