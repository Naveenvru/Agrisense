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
exports.CalendarEvent = void 0;
const typeorm_1 = require("typeorm");
const farmer_crop_entity_1 = require("../farmer-crops/farmer-crop.entity");
let CalendarEvent = class CalendarEvent {
    id;
    farmerCropId;
    farmerCrop;
    eventDate;
    taskName;
    taskDescription;
    isCompleted;
    completedAt;
    generatedByWeather;
    generatedByAi;
    sourceConditionId;
    createdAt;
    updatedAt;
};
exports.CalendarEvent = CalendarEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'farmer_crop_id', type: 'bigint' }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "farmerCropId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => farmer_crop_entity_1.FarmerCrop),
    (0, typeorm_1.JoinColumn)({ name: 'farmer_crop_id' }),
    __metadata("design:type", farmer_crop_entity_1.FarmerCrop)
], CalendarEvent.prototype, "farmerCrop", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_date', type: 'date' }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "eventDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], CalendarEvent.prototype, "taskName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CalendarEvent.prototype, "taskDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_completed', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CalendarEvent.prototype, "isCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], CalendarEvent.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'generated_by_weather', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CalendarEvent.prototype, "generatedByWeather", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'generated_by_ai', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CalendarEvent.prototype, "generatedByAi", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_condition_id', type: 'varchar', length: 24, nullable: true }),
    __metadata("design:type", Object)
], CalendarEvent.prototype, "sourceConditionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], CalendarEvent.prototype, "updatedAt", void 0);
exports.CalendarEvent = CalendarEvent = __decorate([
    (0, typeorm_1.Entity)({ name: 'calendar_events' })
], CalendarEvent);
//# sourceMappingURL=calendar-event.entity.js.map