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
var RegionalSupplyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionalSupplyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const geoboundary_service_1 = require("../../geoboundary/geoboundary.service");
const harvest_mongo_service_1 = require("../../mongodb/harvest/harvest-mongo.service");
const yield_mongo_service_1 = require("../../mongodb/yield/yield-mongo.service");
const supply_mongo_service_1 = require("../../mongodb/supply/supply-mongo.service");
const supply_estimator_interface_1 = require("../interfaces/supply-estimator.interface");
const yield_rule_utils_1 = require("../../yield-intelligence/utils/yield-rule.utils");
const common_2 = require("@nestjs/common");
let RegionalSupplyService = RegionalSupplyService_1 = class RegionalSupplyService {
    dataSource;
    supplyMongoService;
    harvestMongoService;
    yieldMongoService;
    geoBoundaryService;
    supplyEstimator;
    logger = new common_1.Logger(RegionalSupplyService_1.name);
    constructor(dataSource, supplyMongoService, harvestMongoService, yieldMongoService, geoBoundaryService, supplyEstimator) {
        this.dataSource = dataSource;
        this.supplyMongoService = supplyMongoService;
        this.harvestMongoService = harvestMongoService;
        this.yieldMongoService = yieldMongoService;
        this.geoBoundaryService = geoBoundaryService;
        this.supplyEstimator = supplyEstimator;
    }
    async getRegionalSummary(regionLevel, regionName) {
        this.logger.debug(`Regional supply summary request | level=${regionLevel} name=${regionName}`);
        const farmerCropRows = await this.queryActiveFarmerCrops();
        const filteredRows = [];
        for (const row of farmerCropRows) {
            const resolved = await this.resolveRegionHierarchy(row);
            if (this.matchesRegion(resolved, regionLevel, regionName)) {
                filteredRows.push({ ...row, ...resolved });
            }
        }
        if (!filteredRows.length) {
            return {
                regionLevel,
                regionName,
                totalFarmers: 0,
                totalCrops: 0,
                totalSupplyKg: 0,
                availableSupplyKg: 0,
                cropBreakdown: {},
                supplyDensityKgPerAcre: 0,
                summary: 'No active crops found in this region',
                explanations: ['No farmer crops matched the requested regional filter'],
                generatedAt: new Date(),
            };
        }
        const predictions = await Promise.all(filteredRows.map((row) => this.resolvePrediction(row)));
        const validPredictions = predictions.filter(Boolean);
        const totalFarmers = new Set(filteredRows.map((row) => String(row.farmer_profile_id))).size;
        const totalSupplyKg = (0, yield_rule_utils_1.round)(validPredictions.reduce((sum, item) => sum + (item.expectedSupplyKg ?? 0), 0), 0);
        const availableSupplyKg = (0, yield_rule_utils_1.round)(validPredictions.reduce((sum, item) => sum + (item.availableSupplyKg ?? 0), 0), 0);
        const totalArea = filteredRows.reduce((sum, row) => sum + Number(row.area_acres ?? 0), 0);
        const supplyDensityKgPerAcre = totalArea > 0 ? (0, yield_rule_utils_1.round)(availableSupplyKg / totalArea, 2) : 0;
        const cropBreakdown = {};
        for (const row of filteredRows) {
            const cropName = row.crop_name ?? 'Unknown';
            const prediction = validPredictions.find((item) => item.farmerCropId === String(row.farmer_crop_id));
            if (!cropBreakdown[cropName]) {
                cropBreakdown[cropName] = { count: 0, totalSupplyKg: 0, averageSupplyKg: 0, averageConfidence: 0 };
            }
            cropBreakdown[cropName].count += 1;
            if (prediction) {
                cropBreakdown[cropName].totalSupplyKg += prediction.availableSupplyKg ?? 0;
                cropBreakdown[cropName].averageSupplyKg += prediction.availableSupplyKg ?? 0;
                cropBreakdown[cropName].averageConfidence += prediction.confidence ?? 0;
            }
        }
        Object.values(cropBreakdown).forEach((entry) => {
            if (entry.count > 0) {
                entry.averageSupplyKg = (0, yield_rule_utils_1.round)(entry.totalSupplyKg / entry.count, 0);
                entry.averageConfidence = (0, yield_rule_utils_1.round)(entry.averageConfidence / entry.count, 0);
            }
        });
        return {
            regionLevel,
            regionName,
            totalFarmers,
            totalCrops: filteredRows.length,
            totalSupplyKg,
            availableSupplyKg,
            cropBreakdown,
            supplyDensityKgPerAcre,
            summary: `Regional supply summary for ${regionLevel} ${regionName} covers ${filteredRows.length} crops and ${availableSupplyKg} kg available supply.`,
            explanations: [
                'Regional aggregation reused active farmer crop records and current supply predictions',
                `Total area considered: ${(0, yield_rule_utils_1.round)(totalArea, 2)} acres`,
            ],
            generatedAt: new Date(),
        };
    }
    async resolvePrediction(row) {
        const existing = await this.supplyMongoService.findByFarmerCropId(String(row.farmer_crop_id));
        if (existing)
            return existing;
        const harvestAssessment = await this.harvestMongoService.findByFarmerCropId(String(row.farmer_crop_id));
        const yieldAssessment = await this.yieldMongoService.findByFarmerCropId(String(row.farmer_crop_id));
        const region = await this.resolveRegionHierarchy(row);
        const lifecycle = this.buildLifecycleContext(row);
        const context = {
            farmerCropId: String(row.farmer_crop_id),
            farmerProfileId: String(row.farmer_profile_id),
            cropName: row.crop_name ?? 'Unknown',
            cropVariety: row.crop_variety ?? null,
            cropCategory: row.crop_category ?? null,
            regionLevel: region.regionLevel,
            regionName: region.regionName,
            villageName: region.villageName,
            talukName: region.talukName,
            districtName: region.districtName,
            stateName: region.stateName,
            areaAcres: (0, yield_rule_utils_1.safeNumber)(row.area_acres, 1),
            expectedHarvestDate: row.expected_harvest_date ? new Date(row.expected_harvest_date) : harvestAssessment?.optimalHarvestDate ?? null,
            harvestStage: harvestAssessment?.readinessStatus ?? lifecycle.lifecycleStage,
            harvestReadinessScore: harvestAssessment?.readinessScore ?? 50,
            harvestRiskLevel: harvestAssessment?.riskLevel ?? 'low',
            harvestExplanations: harvestAssessment?.explanations ?? [],
            yieldExpectedKg: (0, yield_rule_utils_1.safeNumber)(yieldAssessment?.expectedYieldKg ?? row.estimated_yield_kg ?? harvestAssessment?.expectedYieldKg, 0),
            yieldConfidence: (0, yield_rule_utils_1.safeNumber)(yieldAssessment?.confidence ?? harvestAssessment?.yieldConfidence, 60),
            yieldRiskLevel: String(yieldAssessment?.risk?.level ?? yieldAssessment?.riskLevel ?? 'low'),
            yieldExplanations: yieldAssessment?.explanations ?? [],
            weather: {
                hasRainForecast: false,
                hasHeatStress: false,
                hasColdStress: false,
                hasFloodRisk: false,
                forecastRainProbability: 20,
                currentTemperature: 27,
                currentRainfall: 0,
                weatherCondition: 'stable weather',
            },
            weatherHistory: [],
            activities: {
                totalEvents: 0,
                completedEvents: 0,
                pendingEvents: 0,
                overduePendingEvents: 0,
                completionRate: 100,
                hasLateIrrigation: false,
                hasLateFertilizer: false,
                hasMissedActivities: false,
            },
            lifecycle: lifecycle,
            historicalSupplyKg: [],
            actualYieldKg: row.actual_yield_kg ?? null,
            regionalEventNotes: [],
        };
        return this.supplyEstimator.estimate(context);
    }
    async queryActiveFarmerCrops() {
        return this.dataSource.query(`SELECT
         fc.id AS farmer_crop_id,
         fc.crop_variety,
         fc.sowing_date,
         fc.expected_harvest_date,
         fc.estimated_yield_kg,
         fc.actual_yield_kg,
         c.crop_name,
         c.crop_category,
         c.season,
         c.duration_days,
         flp.area_acres,
         flp.soil_type,
         flp.irrigation_type,
         ST_X(flp.location::geometry) AS longitude,
         ST_Y(flp.location::geometry) AS latitude,
         fp.id AS farmer_profile_id,
         fp.district,
         fp.state,
         fp.village
       FROM farmer_crops fc
       JOIN crops c ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active' AND fc.sowing_date IS NOT NULL`);
    }
    buildLifecycleContext(row) {
        const sowingDate = new Date(row.sowing_date);
        const durationDays = row.duration_days ?? 90;
        const expectedHarvestDate = row.expected_harvest_date ? new Date(row.expected_harvest_date) : null;
        const daysElapsed = Math.max(0, Math.floor((Date.now() - sowingDate.getTime()) / (24 * 60 * 60 * 1000)));
        const daysRemaining = expectedHarvestDate ? Math.max(0, Math.ceil((expectedHarvestDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))) : Math.max(0, durationDays - daysElapsed);
        const growthPercentage = durationDays > 0 ? Math.min(100, Math.round((daysElapsed / durationDays) * 100)) : 0;
        const lifecycleStage = growthPercentage >= 90 ? 'ready' : growthPercentage >= 60 ? 'ripening' : growthPercentage >= 35 ? 'reproductive' : growthPercentage > 0 ? 'vegetative' : 'pre-sowing';
        return {
            sowingDate,
            durationDays,
            expectedHarvestDate,
            daysElapsed,
            daysRemaining,
            growthPercentage,
            lifecycleStage,
        };
    }
    async resolveRegionHierarchy(row) {
        const region = {
            regionLevel: 'district',
            regionName: row.district ?? row.state ?? 'unknown',
            villageName: row.village ?? null,
            talukName: null,
            districtName: row.district ?? null,
            stateName: row.state ?? null,
        };
        if (row.latitude !== null && row.longitude !== null) {
            try {
                const resolved = await this.geoBoundaryService.resolveLocation(Number(row.latitude), Number(row.longitude));
                region.villageName = resolved.villageName ?? region.villageName;
                region.talukName = resolved.talukName ?? region.talukName;
                region.districtName = resolved.districtName ?? region.districtName;
                region.stateName = resolved.stateName ?? region.stateName;
                if (resolved.villageName) {
                    region.regionLevel = 'village';
                    region.regionName = resolved.villageName;
                }
                else if (resolved.talukName) {
                    region.regionLevel = 'taluk';
                    region.regionName = resolved.talukName;
                }
                else if (resolved.districtName) {
                    region.regionLevel = 'district';
                    region.regionName = resolved.districtName;
                }
                else if (resolved.stateName) {
                    region.regionLevel = 'state';
                    region.regionName = resolved.stateName;
                }
            }
            catch {
            }
        }
        return region;
    }
    matchesRegion(region, level, name) {
        const target = name.toLowerCase();
        const candidates = [
            { level: 'village', value: region.villageName },
            { level: 'taluk', value: region.talukName },
            { level: 'district', value: region.districtName },
            { level: 'state', value: region.stateName },
        ];
        const match = candidates.find((candidate) => candidate.level === level && String(candidate.value ?? '').toLowerCase() === target);
        if (match)
            return true;
        return String(region.regionName ?? '').toLowerCase() === target && region.regionLevel === level;
    }
};
exports.RegionalSupplyService = RegionalSupplyService;
exports.RegionalSupplyService = RegionalSupplyService = RegionalSupplyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_2.Inject)(supply_estimator_interface_1.SUPPLY_ESTIMATOR)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        supply_mongo_service_1.SupplyMongoService,
        harvest_mongo_service_1.HarvestMongoService,
        yield_mongo_service_1.YieldMongoService,
        geoboundary_service_1.GeoBoundaryService, Object])
], RegionalSupplyService);
//# sourceMappingURL=regional-supply.service.js.map