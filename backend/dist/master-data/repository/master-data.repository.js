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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MasterDataRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const master_data_schema_1 = require("../../mongodb/master-data/master-data.schema");
let MasterDataRepository = MasterDataRepository_1 = class MasterDataRepository {
    stateModel;
    districtModel;
    talukModel;
    villageModel;
    mandiModel;
    commodityModel;
    cropVarietyModel;
    seasonModel;
    soilTypeModel;
    irrigationTypeModel;
    fertilizerModel;
    pesticideModel;
    logger = new common_1.Logger(MasterDataRepository_1.name);
    constructor(stateModel, districtModel, talukModel, villageModel, mandiModel, commodityModel, cropVarietyModel, seasonModel, soilTypeModel, irrigationTypeModel, fertilizerModel, pesticideModel) {
        this.stateModel = stateModel;
        this.districtModel = districtModel;
        this.talukModel = talukModel;
        this.villageModel = villageModel;
        this.mandiModel = mandiModel;
        this.commodityModel = commodityModel;
        this.cropVarietyModel = cropVarietyModel;
        this.seasonModel = seasonModel;
        this.soilTypeModel = soilTypeModel;
        this.irrigationTypeModel = irrigationTypeModel;
        this.fertilizerModel = fertilizerModel;
        this.pesticideModel = pesticideModel;
    }
    async findStates(query = {}) {
        return this.stateModel.find(query).sort({ name: 1 }).exec();
    }
    async findDistricts(query = {}) {
        return this.districtModel.find(query).sort({ name: 1 }).exec();
    }
    async findTaluks(query = {}) {
        return this.talukModel.find(query).sort({ name: 1 }).exec();
    }
    async findVillages(query = {}) {
        return this.villageModel.find(query).sort({ name: 1 }).exec();
    }
    async findMandis(query = {}) {
        return this.mandiModel.find(query).sort({ name: 1 }).exec();
    }
    async findCommodities(query = {}) {
        return this.commodityModel.find(query).sort({ name: 1 }).exec();
    }
    async findCropVarieties(query = {}) {
        return this.cropVarietyModel.find(query).sort({ name: 1 }).exec();
    }
    async findSeasons(query = {}) {
        return this.seasonModel.find(query).sort({ name: 1 }).exec();
    }
    async findSoilTypes(query = {}) {
        return this.soilTypeModel.find(query).sort({ name: 1 }).exec();
    }
    async findIrrigationTypes(query = {}) {
        return this.irrigationTypeModel.find(query).sort({ name: 1 }).exec();
    }
    async findFertilizers(query = {}) {
        return this.fertilizerModel.find(query).sort({ name: 1 }).exec();
    }
    async findPesticides(query = {}) {
        return this.pesticideModel.find(query).sort({ name: 1 }).exec();
    }
    async upsertStates(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.stateModel.bulkWrite(ops);
    }
    async upsertDistricts(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name, stateId: d.stateId }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.districtModel.bulkWrite(ops);
    }
    async upsertTaluks(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name, districtId: d.districtId }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.talukModel.bulkWrite(ops);
    }
    async upsertVillages(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name, talukId: d.talukId }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.villageModel.bulkWrite(ops);
    }
    async upsertMandis(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name, districtId: d.districtId }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.mandiModel.bulkWrite(ops);
    }
    async upsertCommodities(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.commodityModel.bulkWrite(ops);
    }
    async upsertCropVarieties(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name, commodityId: d.commodityId }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.cropVarietyModel.bulkWrite(ops);
    }
    async upsertSeasons(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.seasonModel.bulkWrite(ops);
    }
    async upsertSoilTypes(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.soilTypeModel.bulkWrite(ops);
    }
    async upsertIrrigationTypes(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.irrigationTypeModel.bulkWrite(ops);
    }
    async upsertFertilizers(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.fertilizerModel.bulkWrite(ops);
    }
    async upsertPesticides(data) {
        const ops = data.map((d) => ({
            updateOne: { filter: { name: d.name }, update: { $set: d }, upsert: true },
        }));
        if (ops.length)
            await this.pesticideModel.bulkWrite(ops);
    }
    getCommodityModel() { return this.commodityModel; }
    getDistrictModel() { return this.districtModel; }
    getMandiModel() { return this.mandiModel; }
};
exports.MasterDataRepository = MasterDataRepository;
exports.MasterDataRepository = MasterDataRepository = MasterDataRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(master_data_schema_1.State.name)),
    __param(1, (0, mongoose_1.InjectModel)(master_data_schema_1.District.name)),
    __param(2, (0, mongoose_1.InjectModel)(master_data_schema_1.Taluk.name)),
    __param(3, (0, mongoose_1.InjectModel)(master_data_schema_1.Village.name)),
    __param(4, (0, mongoose_1.InjectModel)(master_data_schema_1.Mandi.name)),
    __param(5, (0, mongoose_1.InjectModel)(master_data_schema_1.Commodity.name)),
    __param(6, (0, mongoose_1.InjectModel)(master_data_schema_1.CropVariety.name)),
    __param(7, (0, mongoose_1.InjectModel)(master_data_schema_1.Season.name)),
    __param(8, (0, mongoose_1.InjectModel)(master_data_schema_1.SoilType.name)),
    __param(9, (0, mongoose_1.InjectModel)(master_data_schema_1.IrrigationType.name)),
    __param(10, (0, mongoose_1.InjectModel)(master_data_schema_1.Fertilizer.name)),
    __param(11, (0, mongoose_1.InjectModel)(master_data_schema_1.Pesticide.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MasterDataRepository);
//# sourceMappingURL=master-data.repository.js.map