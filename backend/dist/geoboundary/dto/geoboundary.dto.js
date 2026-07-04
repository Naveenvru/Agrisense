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
exports.PolygonLookupDto = exports.ReverseGeocodeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ReverseGeocodeDto {
    lat;
    lon;
}
exports.ReverseGeocodeDto = ReverseGeocodeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude of the location', example: 12.9716 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReverseGeocodeDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude of the location', example: 77.5946 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReverseGeocodeDto.prototype, "lon", void 0);
class PolygonLookupDto {
    adminLevel;
    name;
}
exports.PolygonLookupDto = PolygonLookupDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The administrative level to look up the boundary polygon for.',
        enum: ['village', 'taluk', 'district', 'state', 'country'],
        example: 'district',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['village', 'taluk', 'district', 'state', 'country'], {
        message: 'adminLevel must be one of: village, taluk, district, state, country',
    }),
    __metadata("design:type", String)
], PolygonLookupDto.prototype, "adminLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the administrative unit to fetch the boundary polygon for.',
        example: 'Bengaluru Urban',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolygonLookupDto.prototype, "name", void 0);
//# sourceMappingURL=geoboundary.dto.js.map