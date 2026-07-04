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
var RegionalHarvestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionalHarvestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const harvest_mongo_service_1 = require("../../mongodb/harvest/harvest-mongo.service");
let RegionalHarvestService = RegionalHarvestService_1 = class RegionalHarvestService {
    dataSource;
    harvestMongoService;
    logger = new common_1.Logger(RegionalHarvestService_1.name);
    constructor(dataSource, harvestMongoService) {
        this.dataSource = dataSource;
        this.harvestMongoService = harvestMongoService;
    }
    async getRegionalSummary(regionLevel, regionName) {
        this.logger.debug(`Regional summary request | level=${regionLevel} name=${regionName}`);
        const farmerCropRows = await this.queryFarmerCropsByRegion(regionLevel, regionName);
        if (!farmerCropRows.length) {
            return {
                regionLevel,
                regionName,
                totalFarmers: 0,
                totalCrops: 0,
                summary: 'No active crops found in this region',
                crops: [],
            };
        }
        const farmerCropIds = farmerCropRows.map((r) => String(r.farmer_crop_id));
        const assessments = await Promise.all(farmerCropIds.map(id => this.harvestMongoService.findByFarmerCropId(id)));
        const validAssessments = assessments.filter(Boolean);
        const totalFarmers = new Set(farmerCropRows.map((r) => r.farmer_profile_id)).size;
        const avgReadiness = validAssessments.length
            ? Math.round(validAssessments.reduce((s, a) => s + (a?.readinessScore ?? 0), 0) / validAssessments.length)
            : 0;
        const totalYield = validAssessments.reduce((s, a) => s + (a?.expectedYieldKg ?? 0), 0);
        const readyCrops = validAssessments.filter(a => a?.readinessStatus === 'ready').length;
        const delayedCrops = validAssessments.filter(a => (a?.delayDays ?? 0) > 0).length;
        const cropBreakdown = {};
        for (const row of farmerCropRows) {
            const cropName = row.crop_name ?? 'Unknown';
            const assessment = validAssessments.find(a => a?.farmerCropId === String(row.farmer_crop_id));
            if (!cropBreakdown[cropName])
                cropBreakdown[cropName] = { count: 0, totalYieldKg: 0, avgReadiness: 0 };
            cropBreakdown[cropName].count++;
            if (assessment) {
                cropBreakdown[cropName].totalYieldKg += assessment.expectedYieldKg ?? 0;
                cropBreakdown[cropName].avgReadiness += assessment.readinessScore ?? 0;
            }
        }
        for (const key of Object.keys(cropBreakdown)) {
            if (cropBreakdown[key].count > 0) {
                cropBreakdown[key].avgReadiness = Math.round(cropBreakdown[key].avgReadiness / cropBreakdown[key].count);
            }
        }
        return {
            regionLevel,
            regionName,
            totalFarmers,
            totalCrops: farmerCropRows.length,
            totalAssessed: validAssessments.length,
            avgReadinessScore: avgReadiness,
            totalExpectedYieldKg: Math.round(totalYield),
            readyCrops,
            delayedCrops,
            cropBreakdown,
            generatedAt: new Date(),
        };
    }
    async saveRegionalAnalytics(regionLevel, regionName, periodType, data) {
        const now = new Date();
        const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        await this.harvestMongoService.upsertAnalytics(regionLevel, regionName, periodType, periodStart, {
            ...data,
            periodEnd,
        });
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
            default: whereClause = 'fp.district ILIKE $1';
        }
        return this.dataSource.query(`SELECT
         fc.id              AS farmer_crop_id,
         fc.crop_variety,
         c.crop_name,
         fp.id              AS farmer_profile_id,
         fp.district,
         fp.state,
         fp.village
       FROM farmer_crops     fc
       JOIN crops            c  ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles  fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active'
         AND ${whereClause}`, params);
    }
};
exports.RegionalHarvestService = RegionalHarvestService;
exports.RegionalHarvestService = RegionalHarvestService = RegionalHarvestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        harvest_mongo_service_1.HarvestMongoService])
], RegionalHarvestService);
//# sourceMappingURL=regional-harvest.service.js.map