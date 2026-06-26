"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoBoundaryModule = void 0;
const common_1 = require("@nestjs/common");
const geoboundary_service_1 = require("./geoboundary.service");
const master_data_module_1 = require("../master-data/master-data.module");
const storage_module_1 = require("../storage/common/storage.module");
const geoboundary_mongo_module_1 = require("../mongodb/geoboundary/geoboundary-mongo.module");
const geoboundary_repository_1 = require("./repository/geoboundary.repository");
const mock_geoboundary_provider_1 = require("./providers/mock-geoboundary.provider");
const geoboundary_provider_interface_1 = require("./providers/geoboundary-provider.interface");
const geoboundary_controller_1 = require("./geoboundary.controller");
let GeoBoundaryModule = class GeoBoundaryModule {
};
exports.GeoBoundaryModule = GeoBoundaryModule;
exports.GeoBoundaryModule = GeoBoundaryModule = __decorate([
    (0, common_1.Module)({
        imports: [master_data_module_1.MasterDataModule, storage_module_1.StorageModule, geoboundary_mongo_module_1.GeoBoundaryMongoModule],
        providers: [
            geoboundary_service_1.GeoBoundaryService,
            geoboundary_repository_1.GeoBoundaryRepository,
            {
                provide: geoboundary_provider_interface_1.GEOBOUNDARY_PROVIDER,
                useClass: mock_geoboundary_provider_1.MockGeoBoundaryProvider,
            },
        ],
        controllers: [geoboundary_controller_1.GeoBoundaryController],
        exports: [geoboundary_service_1.GeoBoundaryService, geoboundary_repository_1.GeoBoundaryRepository],
    })
], GeoBoundaryModule);
//# sourceMappingURL=geoboundary.module.js.map