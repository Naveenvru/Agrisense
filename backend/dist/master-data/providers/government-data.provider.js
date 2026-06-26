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
var GovernmentDataProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernmentDataProvider = void 0;
const common_1 = require("@nestjs/common");
const master_data_repository_1 = require("../repository/master-data.repository");
const datalake_service_1 = require("../../storage/datalake/datalake.service");
const storage_constants_1 = require("../../storage/common/storage.constants");
const collector_constants_1 = require("../../collectors/common/collector.constants");
let GovernmentDataProvider = GovernmentDataProvider_1 = class GovernmentDataProvider {
    repository;
    dataLakeService;
    logger = new common_1.Logger(GovernmentDataProvider_1.name);
    mockData = {
        states: [
            { name: 'Karnataka', code: 'KA' },
            { name: 'Maharashtra', code: 'MH' },
            { name: 'Gujarat', code: 'GJ' },
        ],
        districts: [
            { name: 'Bengaluru Urban', stateId: 'Karnataka' },
            { name: 'Nashik', stateId: 'Maharashtra' },
            { name: 'Ahmedabad', stateId: 'Gujarat' },
        ],
        commodities: [
            { name: 'Rice', category: 'Cereals' },
            { name: 'Wheat', category: 'Cereals' },
            { name: 'Tomato', category: 'Vegetables' },
            { name: 'Onion', category: 'Vegetables' },
        ],
        mandis: [
            { name: 'Bengaluru APMC', districtId: 'Bengaluru Urban' },
            { name: 'Nashik APMC', districtId: 'Nashik' },
            { name: 'Azadpur Mandi', districtId: 'New Delhi' },
        ],
        soilTypes: [
            { name: 'Alluvial Soil', description: 'Very fertile' },
            { name: 'Black Soil', description: 'Good for cotton' },
            { name: 'Red Soil', description: 'Rich in iron' },
        ]
    };
    constructor(repository, dataLakeService) {
        this.repository = repository;
        this.dataLakeService = dataLakeService;
    }
    async importAll() {
        try {
            this.logger.log('Starting master data import from GovernmentDataProvider...');
            const data = this.mockData;
            const collectionResult = {
                domain: collector_constants_1.COLLECTOR_CONSTANTS.DOMAINS.GOVERNMENT,
                operation: 'master_data_import',
                provider: 'government_mock_api',
                rawData: data,
                status: collector_constants_1.COLLECTOR_CONSTANTS.STATUS.SUCCESS,
                collectedAt: new Date(),
                durationMs: 0,
                retryCount: 0,
            };
            const storageResult = await this.dataLakeService.writeRaw(storage_constants_1.STORAGE_CONSTANTS.DOMAINS.GOVERNMENT, collectionResult);
            if (storageResult.success) {
                this.logger.log(`Raw master data stored | file=${storageResult.location?.filename}`);
            }
            else {
                this.logger.error(`Failed to store raw master data | ${storageResult.errorMessage}`);
            }
            await this.repository.upsertStates(data.states);
            await this.repository.upsertDistricts(data.districts);
            await this.repository.upsertCommodities(data.commodities);
            await this.repository.upsertMandis(data.mandis);
            await this.repository.upsertSoilTypes(data.soilTypes);
            this.logger.log('Master data import complete');
            return { success: true, message: 'Master data imported successfully' };
        }
        catch (error) {
            this.logger.error(`Error during master data import: ${error.message}`);
            return { success: false, message: error.message };
        }
    }
};
exports.GovernmentDataProvider = GovernmentDataProvider;
exports.GovernmentDataProvider = GovernmentDataProvider = GovernmentDataProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [master_data_repository_1.MasterDataRepository,
        datalake_service_1.DataLakeService])
], GovernmentDataProvider);
//# sourceMappingURL=government-data.provider.js.map