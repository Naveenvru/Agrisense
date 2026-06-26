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
var MasterDataController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterDataController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const master_data_dto_1 = require("./dto/master-data.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const master_data_service_1 = require("./master-data.service");
let MasterDataController = MasterDataController_1 = class MasterDataController {
    masterDataService;
    logger = new common_1.Logger(MasterDataController_1.name);
    constructor(masterDataService) {
        this.masterDataService = masterDataService;
    }
    health() {
        return this.masterDataService.healthCheck();
    }
    getStates() {
        return this.masterDataService.getStates();
    }
    getDistricts(query) {
        return this.masterDataService.getDistricts(query.stateId);
    }
    getTaluks(query) {
        return this.masterDataService.getTaluks(query.districtId);
    }
    getVillages(query) {
        return this.masterDataService.getVillages(query.talukId);
    }
    getMandis(query) {
        return this.masterDataService.getMandis(query.districtId);
    }
    getCommodities() {
        return this.masterDataService.getCommodities();
    }
    getCropVarieties(query) {
        return this.masterDataService.getCropVarieties(query.commodityId);
    }
    getSeasons() {
        return this.masterDataService.getSeasons();
    }
    getSoilTypes() {
        return this.masterDataService.getSoilTypes();
    }
    getIrrigationTypes() {
        return this.masterDataService.getIrrigationTypes();
    }
    getFertilizers() {
        return this.masterDataService.getFertilizers();
    }
    getPesticides() {
        return this.masterDataService.getPesticides();
    }
    searchCommodities(query) {
        return this.masterDataService.searchCommodities(query.q || '');
    }
    searchDistricts(query) {
        return this.masterDataService.searchDistricts(query.q || '');
    }
    searchMandis(query) {
        return this.masterDataService.searchMandis(query.q || '');
    }
    importData() {
        return this.masterDataService.triggerImport();
    }
};
exports.MasterDataController = MasterDataController;
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Master Data module health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module status returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('states'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all states (alphabetical)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of states' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getStates", null);
__decorate([
    (0, common_1.Get)('districts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get districts, optionally filtered by state' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of districts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.DistrictQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getDistricts", null);
__decorate([
    (0, common_1.Get)('taluks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get taluks, optionally filtered by district' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of taluks' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.TalukQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getTaluks", null);
__decorate([
    (0, common_1.Get)('villages'),
    (0, swagger_1.ApiOperation)({ summary: 'Get villages, optionally filtered by taluk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of villages' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.VillageQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getVillages", null);
__decorate([
    (0, common_1.Get)('markets'),
    (0, swagger_1.ApiOperation)({ summary: 'Get mandis/markets, optionally filtered by district' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of mandis' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.MandiQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getMandis", null);
__decorate([
    (0, common_1.Get)('commodities'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all commodities (alphabetical)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of commodities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getCommodities", null);
__decorate([
    (0, common_1.Get)('crop-varieties'),
    (0, swagger_1.ApiOperation)({ summary: 'Get crop varieties, optionally filtered by commodity' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of crop varieties' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.CropVarietyQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getCropVarieties", null);
__decorate([
    (0, common_1.Get)('seasons'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agricultural seasons' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of seasons' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getSeasons", null);
__decorate([
    (0, common_1.Get)('soil-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all soil types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of soil types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getSoilTypes", null);
__decorate([
    (0, common_1.Get)('irrigation-types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all irrigation types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of irrigation types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getIrrigationTypes", null);
__decorate([
    (0, common_1.Get)('fertilizers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all fertilizers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of fertilizers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getFertilizers", null);
__decorate([
    (0, common_1.Get)('pesticides'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all pesticides' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pesticides' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "getPesticides", null);
__decorate([
    (0, common_1.Get)('search/commodities'),
    (0, swagger_1.ApiOperation)({ summary: 'Search commodities by prefix (autocomplete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matching commodities' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.SearchQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "searchCommodities", null);
__decorate([
    (0, common_1.Get)('search/districts'),
    (0, swagger_1.ApiOperation)({ summary: 'Search districts by prefix (autocomplete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matching districts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.SearchQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "searchDistricts", null);
__decorate([
    (0, common_1.Get)('search/markets'),
    (0, swagger_1.ApiOperation)({ summary: 'Search markets/mandis by prefix (autocomplete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Matching markets' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [master_data_dto_1.SearchQueryDto]),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "searchMandis", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger master data import from GovernmentDataProvider' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Import result' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MasterDataController.prototype, "importData", null);
exports.MasterDataController = MasterDataController = MasterDataController_1 = __decorate([
    (0, swagger_1.ApiTags)('Agricultural Master Data'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('master'),
    __metadata("design:paramtypes", [master_data_service_1.MasterDataService])
], MasterDataController);
//# sourceMappingURL=master-data.controller.js.map