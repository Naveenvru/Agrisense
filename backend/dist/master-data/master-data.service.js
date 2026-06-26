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
var MasterDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataService = void 0;
const common_1 = require("@nestjs/common");
const master_data_repository_1 = require("./repository/master-data.repository");
const hash_map_service_1 = require("./data-structures/hash-map.service");
const trie_search_service_1 = require("./data-structures/trie-search.service");
const government_data_provider_1 = require("./providers/government-data.provider");
let MasterDataService = MasterDataService_1 = class MasterDataService {
    repository;
    hashMapService;
    trieSearchService;
    governmentProvider;
    logger = new common_1.Logger(MasterDataService_1.name);
    constructor(repository, hashMapService, trieSearchService, governmentProvider) {
        this.repository = repository;
        this.hashMapService = hashMapService;
        this.trieSearchService = trieSearchService;
        this.governmentProvider = governmentProvider;
    }
    async getStates() {
        return this.repository.findStates();
    }
    async getDistricts(stateId) {
        return this.repository.findDistricts(stateId ? { stateId } : {});
    }
    async getTaluks(districtId) {
        return this.repository.findTaluks(districtId ? { districtId } : {});
    }
    async getVillages(talukId) {
        return this.repository.findVillages(talukId ? { talukId } : {});
    }
    async getMandis(districtId) {
        return this.repository.findMandis(districtId ? { districtId } : {});
    }
    async getCommodities() {
        return this.repository.findCommodities();
    }
    async getCropVarieties(commodityId) {
        return this.repository.findCropVarieties(commodityId ? { commodityId } : {});
    }
    async getSeasons() {
        return this.repository.findSeasons();
    }
    async getSoilTypes() {
        return this.repository.findSoilTypes();
    }
    async getIrrigationTypes() {
        return this.repository.findIrrigationTypes();
    }
    async getFertilizers() {
        return this.repository.findFertilizers();
    }
    async getPesticides() {
        return this.repository.findPesticides();
    }
    searchCommodities(q) {
        return this.trieSearchService.searchCommodities(q);
    }
    searchDistricts(q) {
        return this.trieSearchService.searchDistricts(q);
    }
    searchMandis(q) {
        return this.trieSearchService.searchMandis(q);
    }
    async triggerImport() {
        const result = await this.governmentProvider.importAll();
        if (result.success) {
            await this.hashMapService.refreshAll();
            await this.trieSearchService.refreshAll();
        }
        return result;
    }
    healthCheck() {
        this.logger.log('MasterDataService health check called');
        return { status: 'initialising', module: 'master-data' };
    }
};
exports.MasterDataService = MasterDataService;
exports.MasterDataService = MasterDataService = MasterDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [master_data_repository_1.MasterDataRepository,
        hash_map_service_1.HashMapService,
        trie_search_service_1.TrieSearchService,
        government_data_provider_1.GovernmentDataProvider])
], MasterDataService);
//# sourceMappingURL=master-data.service.js.map