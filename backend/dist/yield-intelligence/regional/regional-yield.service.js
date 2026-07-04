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
var RegionalYieldService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionalYieldService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const geoboundary_service_1 = require("../../geoboundary/geoboundary.service");
const yield_mongo_service_1 = require("../../mongodb/yield/yield-mongo.service");
const yield_rule_utils_1 = require("../utils/yield-rule.utils");
let RegionalYieldService = RegionalYieldService_1 = class RegionalYieldService {
    dataSource;
    yieldMongoService;
    geoBoundaryService;
    logger = new common_1.Logger(RegionalYieldService_1.name);
    constructor(dataSource, yieldMongoService, geoBoundaryService) {
        this.dataSource = dataSource;
        this.yieldMongoService = yieldMongoService;
        this.geoBoundaryService = geoBoundaryService;
    }
    async getRegionalSummary(regionLevel, regionName) {
        this.logger.debug(`Regional yield summary request | level=${regionLevel} name=${regionName}`);
        const farmerCropRows = await this.queryFarmerCropsByRegion(regionLevel, regionName);
        if (!farmerCropRows.length) {
            return {
                regionLevel,
                regionName,
                totalFarmers: 0,
                totalCrops: 0,
                totalExpectedYieldKg: 0,
                averageYieldKg: 0,
                cropBreakdown: {},
                regionalYieldDensityKgPerAcre: 0,
                summary: 'No active crops found in this region',
                explanations: ['No farmer crops matched the requested regional filter'],
                generatedAt: new Date(),
            };
        }
        const farmerCropIds = farmerCropRows.map((row) => String(row.farmer_crop_id));
        const predictions = await Promise.all(farmerCropIds.map((id) => this.yieldMongoService.findByFarmerCropId(id)));
        const validPredictions = predictions.filter(Boolean);
        const totalFarmers = new Set(farmerCropRows.map((row) => String(row.farmer_profile_id))).size;
        const totalExpectedYieldKg = (0, yield_rule_utils_1.round)(validPredictions.reduce((sum, item) => sum + (item.expectedYieldKg ?? 0), 0), 0);
        const averageYieldKg = validPredictions.length ? (0, yield_rule_utils_1.round)(totalExpectedYieldKg / validPredictions.length, 0) : 0;
        const totalArea = farmerCropRows.reduce((sum, row) => sum + Number(row.area_acres ?? 0), 0);
        const regionalYieldDensityKgPerAcre = totalArea > 0 ? (0, yield_rule_utils_1.round)(totalExpectedYieldKg / totalArea, 2) : 0;
        const cropBreakdown = {};
        for (const row of farmerCropRows) {
            const cropName = row.crop_name ?? 'Unknown';
            const prediction = validPredictions.find((item) => item.farmerCropId === String(row.farmer_crop_id));
            if (!cropBreakdown[cropName]) {
                cropBreakdown[cropName] = {
                    count: 0,
                    totalExpectedYieldKg: 0,
                    averageYieldKg: 0,
                    averageConfidence: 0,
                };
            }
            cropBreakdown[cropName].count += 1;
            if (prediction) {
                cropBreakdown[cropName].totalExpectedYieldKg += prediction.expectedYieldKg ?? 0;
                cropBreakdown[cropName].averageYieldKg += prediction.expectedYieldKg ?? 0;
                cropBreakdown[cropName].averageConfidence += prediction.confidence ?? 0;
            }
        }
        Object.values(cropBreakdown).forEach((entry) => {
            if (entry.count > 0) {
                entry.averageYieldKg = (0, yield_rule_utils_1.round)(entry.totalExpectedYieldKg / entry.count, 0);
                entry.averageConfidence = (0, yield_rule_utils_1.round)(entry.averageConfidence / entry.count, 0);
            }
        });
        const summary = `Regional yield summary for ${regionLevel} ${regionName} covers ${farmerCropRows.length} crops and ${totalExpectedYieldKg} kg expected production.`;
        return {
            regionLevel,
            regionName,
            totalFarmers,
            totalCrops: farmerCropRows.length,
            totalExpectedYieldKg,
            averageYieldKg,
            cropBreakdown,
            regionalYieldDensityKgPerAcre,
            summary,
            explanations: [
                `Regional aggregation reused active farmer crop records and current yield predictions`,
                `Total area considered: ${(0, yield_rule_utils_1.round)(totalArea, 2)} acres`,
            ],
            generatedAt: new Date(),
        };
    }
    async queryFarmerCropsByRegion(regionLevel, regionName) {
        let whereClause = '';
        const params = [regionName];
        switch (regionLevel) {
            case 'state':
                whereClause = 'fp.state ILIKE $1';
                break;
            case 'district':
                whereClause = 'fp.district ILIKE $1';
                break;
            case 'taluk':
                whereClause = 'fp.district ILIKE $1';
                break;
            case 'village':
                whereClause = 'fp.village ILIKE $1';
                break;
            default:
                whereClause = 'fp.district ILIKE $1';
        }
        return this.dataSource.query(`SELECT
         fc.id AS farmer_crop_id,
         fc.crop_variety,
         c.crop_name,
         fc.sowing_date,
         flp.area_acres,
         flp.soil_type,
         flp.irrigation_type,
         fp.id AS farmer_profile_id,
         fp.district,
         fp.state,
         fp.village,
         ST_X(flp.location::geometry) AS longitude,
         ST_Y(flp.location::geometry) AS latitude
       FROM farmer_crops fc
       JOIN crops c ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active'
         AND ${whereClause}`, params);
    }
};
exports.RegionalYieldService = RegionalYieldService;
exports.RegionalYieldService = RegionalYieldService = RegionalYieldService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        yield_mongo_service_1.YieldMongoService,
        geoboundary_service_1.GeoBoundaryService])
], RegionalYieldService);
//# sourceMappingURL=regional-yield.service.js.map