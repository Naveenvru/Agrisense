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
exports.CropCalendarTemplate = void 0;
const typeorm_1 = require("typeorm");
const crop_entity_1 = require("../crops/crop.entity");
let CropCalendarTemplate = class CropCalendarTemplate {
    id;
    cropId;
    crop;
    dayOffset;
    taskName;
    taskDescription;
    priority;
    createdAt;
    updatedAt;
};
exports.CropCalendarTemplate = CropCalendarTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CropCalendarTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'crop_id', type: 'bigint' }),
    __metadata("design:type", String)
], CropCalendarTemplate.prototype, "cropId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => crop_entity_1.Crop),
    (0, typeorm_1.JoinColumn)({ name: 'crop_id' }),
    __metadata("design:type", crop_entity_1.Crop)
], CropCalendarTemplate.prototype, "crop", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'day_offset', type: 'int' }),
    __metadata("design:type", Number)
], CropCalendarTemplate.prototype, "dayOffset", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CropCalendarTemplate.prototype, "taskName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CropCalendarTemplate.prototype, "taskDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], CropCalendarTemplate.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], CropCalendarTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], CropCalendarTemplate.prototype, "updatedAt", void 0);
exports.CropCalendarTemplate = CropCalendarTemplate = __decorate([
    (0, typeorm_1.Entity)({ name: 'crop_calendar_templates' })
], CropCalendarTemplate);
//# sourceMappingURL=crop-calendar-template.entity.js.map