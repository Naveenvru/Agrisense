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
exports.CropVarietyQueryDto = exports.MandiQueryDto = exports.VillageQueryDto = exports.TalukQueryDto = exports.DistrictQueryDto = exports.SearchQueryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SearchQueryDto {
    q;
}
exports.SearchQueryDto = SearchQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Search query string (prefix search)', example: 'bang' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchQueryDto.prototype, "q", void 0);
class DistrictQueryDto {
    stateId;
}
exports.DistrictQueryDto = DistrictQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by state ID', example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], DistrictQueryDto.prototype, "stateId", void 0);
class TalukQueryDto {
    districtId;
}
exports.TalukQueryDto = TalukQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by district ID', example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], TalukQueryDto.prototype, "districtId", void 0);
class VillageQueryDto {
    talukId;
}
exports.VillageQueryDto = VillageQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by taluk ID', example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], VillageQueryDto.prototype, "talukId", void 0);
class MandiQueryDto {
    districtId;
}
exports.MandiQueryDto = MandiQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by district ID', example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], MandiQueryDto.prototype, "districtId", void 0);
class CropVarietyQueryDto {
    commodityId;
}
exports.CropVarietyQueryDto = CropVarietyQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by commodity ID', example: '507f1f77bcf86cd799439011' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CropVarietyQueryDto.prototype, "commodityId", void 0);
//# sourceMappingURL=master-data.dto.js.map