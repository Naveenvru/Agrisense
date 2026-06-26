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
var HashMapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashMapService = void 0;
const common_1 = require("@nestjs/common");
const master_data_repository_1 = require("../repository/master-data.repository");
let HashMapService = HashMapService_1 = class HashMapService {
    repository;
    logger = new common_1.Logger(HashMapService_1.name);
    stateMap = new Map();
    districtMap = new Map();
    commodityMap = new Map();
    mandiMap = new Map();
    stateIdMap = new Map();
    districtIdMap = new Map();
    commodityIdMap = new Map();
    mandiIdMap = new Map();
    constructor(repository) {
        this.repository = repository;
    }
    async onApplicationBootstrap() {
        await this.refreshAll();
    }
    async refreshAll() {
        this.logger.log('Refreshing Master Data HashMaps...');
        try {
            const [states, districts, commodities, mandis] = await Promise.all([
                this.repository.findStates(),
                this.repository.findDistricts(),
                this.repository.findCommodities(),
                this.repository.findMandis(),
            ]);
            this.stateMap.clear();
            this.stateIdMap.clear();
            for (const state of states) {
                const idStr = state._id.toString();
                this.stateMap.set(state.name.toLowerCase(), idStr);
                this.stateIdMap.set(idStr, state);
            }
            this.districtMap.clear();
            this.districtIdMap.clear();
            for (const district of districts) {
                const idStr = district._id.toString();
                this.districtMap.set(district.name.toLowerCase(), idStr);
                this.districtIdMap.set(idStr, district);
            }
            this.commodityMap.clear();
            this.commodityIdMap.clear();
            for (const commodity of commodities) {
                const idStr = commodity._id.toString();
                this.commodityMap.set(commodity.name.toLowerCase(), idStr);
                this.commodityIdMap.set(idStr, commodity);
            }
            this.mandiMap.clear();
            this.mandiIdMap.clear();
            for (const mandi of mandis) {
                const idStr = mandi._id.toString();
                this.mandiMap.set(mandi.name.toLowerCase(), idStr);
                this.mandiIdMap.set(idStr, mandi);
            }
            this.logger.log(`HashMaps refreshed: ${this.stateMap.size} States, ${this.districtMap.size} Districts, ${this.commodityMap.size} Commodities, ${this.mandiMap.size} Mandis.`);
        }
        catch (error) {
            this.logger.error(`Failed to refresh HashMaps: ${error.message}`);
        }
    }
    getStateId(name) {
        return this.stateMap.get(name.toLowerCase());
    }
    getStateById(id) {
        return this.stateIdMap.get(id);
    }
    getDistrictId(name) {
        return this.districtMap.get(name.toLowerCase());
    }
    getDistrictById(id) {
        return this.districtIdMap.get(id);
    }
    getCommodityId(name) {
        return this.commodityMap.get(name.toLowerCase());
    }
    getCommodityById(id) {
        return this.commodityIdMap.get(id);
    }
    getMandiId(name) {
        return this.mandiMap.get(name.toLowerCase());
    }
    getMandiById(id) {
        return this.mandiIdMap.get(id);
    }
};
exports.HashMapService = HashMapService;
exports.HashMapService = HashMapService = HashMapService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [master_data_repository_1.MasterDataRepository])
], HashMapService);
//# sourceMappingURL=hash-map.service.js.map