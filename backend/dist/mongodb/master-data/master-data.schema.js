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
exports.PesticideSchema = exports.Pesticide = exports.FertilizerSchema = exports.Fertilizer = exports.IrrigationTypeSchema = exports.IrrigationType = exports.SoilTypeSchema = exports.SoilType = exports.SeasonSchema = exports.Season = exports.CropVarietySchema = exports.CropVariety = exports.CommoditySchema = exports.Commodity = exports.MandiSchema = exports.Mandi = exports.VillageSchema = exports.Village = exports.TalukSchema = exports.Taluk = exports.DistrictSchema = exports.District = exports.StateSchema = exports.State = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let State = class State extends mongoose_2.Document {
    name;
    code;
};
exports.State = State;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], State.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], State.prototype, "code", void 0);
exports.State = State = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_states' })
], State);
exports.StateSchema = mongoose_1.SchemaFactory.createForClass(State);
let District = class District extends mongoose_2.Document {
    name;
    stateId;
};
exports.District = District;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], District.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], District.prototype, "stateId", void 0);
exports.District = District = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_districts' })
], District);
exports.DistrictSchema = mongoose_1.SchemaFactory.createForClass(District);
exports.DistrictSchema.index({ name: 1, stateId: 1 }, { unique: true });
let Taluk = class Taluk extends mongoose_2.Document {
    name;
    districtId;
};
exports.Taluk = Taluk;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Taluk.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Taluk.prototype, "districtId", void 0);
exports.Taluk = Taluk = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_taluks' })
], Taluk);
exports.TalukSchema = mongoose_1.SchemaFactory.createForClass(Taluk);
exports.TalukSchema.index({ name: 1, districtId: 1 }, { unique: true });
let Village = class Village extends mongoose_2.Document {
    name;
    talukId;
};
exports.Village = Village;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Village.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Village.prototype, "talukId", void 0);
exports.Village = Village = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_villages' })
], Village);
exports.VillageSchema = mongoose_1.SchemaFactory.createForClass(Village);
exports.VillageSchema.index({ name: 1, talukId: 1 }, { unique: true });
let Mandi = class Mandi extends mongoose_2.Document {
    name;
    districtId;
};
exports.Mandi = Mandi;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Mandi.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Mandi.prototype, "districtId", void 0);
exports.Mandi = Mandi = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_mandis' })
], Mandi);
exports.MandiSchema = mongoose_1.SchemaFactory.createForClass(Mandi);
exports.MandiSchema.index({ name: 1, districtId: 1 }, { unique: true });
let Commodity = class Commodity extends mongoose_2.Document {
    name;
    category;
};
exports.Commodity = Commodity;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Commodity.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Commodity.prototype, "category", void 0);
exports.Commodity = Commodity = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_commodities' })
], Commodity);
exports.CommoditySchema = mongoose_1.SchemaFactory.createForClass(Commodity);
let CropVariety = class CropVariety extends mongoose_2.Document {
    name;
    commodityId;
};
exports.CropVariety = CropVariety;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], CropVariety.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], CropVariety.prototype, "commodityId", void 0);
exports.CropVariety = CropVariety = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_crop_varieties' })
], CropVariety);
exports.CropVarietySchema = mongoose_1.SchemaFactory.createForClass(CropVariety);
exports.CropVarietySchema.index({ name: 1, commodityId: 1 }, { unique: true });
let Season = class Season extends mongoose_2.Document {
    name;
    startMonth;
    endMonth;
};
exports.Season = Season;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Season.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Season.prototype, "startMonth", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Season.prototype, "endMonth", void 0);
exports.Season = Season = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_seasons' })
], Season);
exports.SeasonSchema = mongoose_1.SchemaFactory.createForClass(Season);
let SoilType = class SoilType extends mongoose_2.Document {
    name;
    description;
};
exports.SoilType = SoilType;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], SoilType.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SoilType.prototype, "description", void 0);
exports.SoilType = SoilType = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_soil_types' })
], SoilType);
exports.SoilTypeSchema = mongoose_1.SchemaFactory.createForClass(SoilType);
let IrrigationType = class IrrigationType extends mongoose_2.Document {
    name;
};
exports.IrrigationType = IrrigationType;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], IrrigationType.prototype, "name", void 0);
exports.IrrigationType = IrrigationType = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_irrigation_types' })
], IrrigationType);
exports.IrrigationTypeSchema = mongoose_1.SchemaFactory.createForClass(IrrigationType);
let Fertilizer = class Fertilizer extends mongoose_2.Document {
    name;
    type;
};
exports.Fertilizer = Fertilizer;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Fertilizer.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Fertilizer.prototype, "type", void 0);
exports.Fertilizer = Fertilizer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_fertilizers' })
], Fertilizer);
exports.FertilizerSchema = mongoose_1.SchemaFactory.createForClass(Fertilizer);
let Pesticide = class Pesticide extends mongoose_2.Document {
    name;
    type;
};
exports.Pesticide = Pesticide;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Pesticide.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Pesticide.prototype, "type", void 0);
exports.Pesticide = Pesticide = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'master_pesticides' })
], Pesticide);
exports.PesticideSchema = mongoose_1.SchemaFactory.createForClass(Pesticide);
//# sourceMappingURL=master-data.schema.js.map