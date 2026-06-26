"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataModule = void 0;
const common_1 = require("@nestjs/common");
const master_data_controller_1 = require("./master-data.controller");
const master_data_service_1 = require("./master-data.service");
const master_data_mongo_module_1 = require("../mongodb/master-data/master-data-mongo.module");
const master_data_repository_1 = require("./repository/master-data.repository");
const government_data_provider_1 = require("./providers/government-data.provider");
const storage_module_1 = require("../storage/common/storage.module");
const hash_map_service_1 = require("./data-structures/hash-map.service");
const trie_search_service_1 = require("./data-structures/trie-search.service");
let MasterDataModule = class MasterDataModule {
};
exports.MasterDataModule = MasterDataModule;
exports.MasterDataModule = MasterDataModule = __decorate([
    (0, common_1.Module)({
        imports: [master_data_mongo_module_1.MasterDataMongoModule, storage_module_1.StorageModule],
        controllers: [master_data_controller_1.MasterDataController],
        providers: [master_data_service_1.MasterDataService, master_data_repository_1.MasterDataRepository, government_data_provider_1.GovernmentDataProvider, hash_map_service_1.HashMapService, trie_search_service_1.TrieSearchService],
        exports: [master_data_service_1.MasterDataService, master_data_repository_1.MasterDataRepository, government_data_provider_1.GovernmentDataProvider, hash_map_service_1.HashMapService, trie_search_service_1.TrieSearchService],
    })
], MasterDataModule);
//# sourceMappingURL=master-data.module.js.map