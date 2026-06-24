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
exports.Crop = void 0;
const typeorm_1 = require("typeorm");
let Crop = class Crop {
    id;
    cropName;
    scientificName;
    cropCategory;
    season;
    durationDays;
    waterRequirement;
    idealTemperatureMin;
    idealTemperatureMax;
    createdAt;
    updatedAt;
};
exports.Crop = Crop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], Crop.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crop_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Crop.prototype, "cropName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scientific_name', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Crop.prototype, "scientificName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crop_category', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Crop.prototype, "cropCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], Crop.prototype, "season", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_days', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Crop.prototype, "durationDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'water_requirement', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], Crop.prototype, "waterRequirement", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ideal_temperature_min', type: 'numeric', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Crop.prototype, "idealTemperatureMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ideal_temperature_max', type: 'numeric', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Object)
], Crop.prototype, "idealTemperatureMax", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Crop.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], Crop.prototype, "updatedAt", void 0);
exports.Crop = Crop = __decorate([
    (0, typeorm_1.Entity)({ name: 'crops' })
], Crop);
//# sourceMappingURL=crop.entity.js.map