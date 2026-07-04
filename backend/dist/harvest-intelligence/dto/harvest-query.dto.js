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
exports.HistoryQueryDto = exports.AnalyticsQueryDto = exports.RegionalQueryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegionalQueryDto {
    level = 'district';
    name;
}
exports.RegionalQueryDto = RegionalQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Region level', enum: ['village', 'taluk', 'district', 'state'], example: 'district' }),
    (0, class_validator_1.IsIn)(['village', 'taluk', 'district', 'state']),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegionalQueryDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Region name', example: 'Bengaluru Urban' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegionalQueryDto.prototype, "name", void 0);
class AnalyticsQueryDto {
    regionLevel;
    regionName;
    periodType;
    limit;
}
exports.AnalyticsQueryDto = AnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Region level for analytics', enum: ['district', 'state'], example: 'district' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "regionLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Region name filter', example: 'Bengaluru' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "regionName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Period type', enum: ['weekly', 'monthly'], example: 'monthly' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['weekly', 'monthly']),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Result limit', example: '12' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], AnalyticsQueryDto.prototype, "limit", void 0);
class HistoryQueryDto {
    limit;
}
exports.HistoryQueryDto = HistoryQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum history entries to return', example: '10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], HistoryQueryDto.prototype, "limit", void 0);
//# sourceMappingURL=harvest-query.dto.js.map