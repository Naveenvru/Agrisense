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
var TrieSearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrieSearchService = void 0;
const common_1 = require("@nestjs/common");
const master_data_repository_1 = require("../repository/master-data.repository");
const trie_1 = require("./trie");
let TrieSearchService = TrieSearchService_1 = class TrieSearchService {
    repository;
    logger = new common_1.Logger(TrieSearchService_1.name);
    commodityTrie = new trie_1.Trie();
    districtTrie = new trie_1.Trie();
    mandiTrie = new trie_1.Trie();
    constructor(repository) {
        this.repository = repository;
    }
    async onApplicationBootstrap() {
        await this.refreshAll();
    }
    async refreshAll() {
        this.logger.log('Refreshing Master Data Tries...');
        try {
            const [commodities, districts, mandis] = await Promise.all([
                this.repository.findCommodities(),
                this.repository.findDistricts(),
                this.repository.findMandis(),
            ]);
            this.commodityTrie.clear();
            for (const commodity of commodities) {
                this.commodityTrie.insert(commodity.name, commodity);
            }
            this.districtTrie.clear();
            for (const district of districts) {
                this.districtTrie.insert(district.name, district);
            }
            this.mandiTrie.clear();
            for (const mandi of mandis) {
                this.mandiTrie.insert(mandi.name, mandi);
            }
            this.logger.log(`Tries refreshed: ${commodities.length} Commodities, ${districts.length} Districts, ${mandis.length} Mandis.`);
        }
        catch (error) {
            this.logger.error(`Failed to refresh Tries: ${error.message}`);
        }
    }
    searchCommodities(prefix) {
        if (!prefix || prefix.trim().length === 0)
            return [];
        return this.commodityTrie.searchPrefix(prefix.trim());
    }
    searchDistricts(prefix) {
        if (!prefix || prefix.trim().length === 0)
            return [];
        return this.districtTrie.searchPrefix(prefix.trim());
    }
    searchMandis(prefix) {
        if (!prefix || prefix.trim().length === 0)
            return [];
        return this.mandiTrie.searchPrefix(prefix.trim());
    }
};
exports.TrieSearchService = TrieSearchService;
exports.TrieSearchService = TrieSearchService = TrieSearchService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [master_data_repository_1.MasterDataRepository])
], TrieSearchService);
//# sourceMappingURL=trie-search.service.js.map