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
exports.DemandActionQueryDto = exports.DemandAnalyticsQueryDto = exports.RegionalDemandQueryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegionalDemandQueryDto {
    level;
    name;
}
exports.RegionalDemandQueryDto = RegionalDemandQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'district', description: 'Region level: village | taluk | district | state' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegionalDemandQueryDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bengaluru Urban', description: 'Region name to query' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegionalDemandQueryDto.prototype, "name", void 0);
class DemandAnalyticsQueryDto {
    regionLevel;
    regionName;
    periodType;
    limit;
}
exports.DemandAnalyticsQueryDto = DemandAnalyticsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'district' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DemandAnalyticsQueryDto.prototype, "regionLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bengaluru Urban' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DemandAnalyticsQueryDto.prototype, "regionName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'monthly' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DemandAnalyticsQueryDto.prototype, "periodType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '12' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], DemandAnalyticsQueryDto.prototype, "limit", void 0);
class DemandActionQueryDto {
    farmerCropId;
}
exports.DemandActionQueryDto = DemandActionQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'farmerCropId to recalculate, or omit for full portfolio' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DemandActionQueryDto.prototype, "farmerCropId", void 0);
//# sourceMappingURL=demand-query.dto.js.map