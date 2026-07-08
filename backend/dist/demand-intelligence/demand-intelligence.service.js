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
var DemandIntelligenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandIntelligenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const weather_service_1 = require("../weather/weather.service");
const geoboundary_service_1 = require("../geoboundary/geoboundary.service");
const harvest_mongo_service_1 = require("../mongodb/harvest/harvest-mongo.service");
const yield_mongo_service_1 = require("../mongodb/yield/yield-mongo.service");
const supply_mongo_service_1 = require("../mongodb/supply/supply-mongo.service");
const demand_mongo_service_1 = require("../mongodb/demand/demand-mongo.service");
const market_repository_1 = require("../market/repository/market.repository");
const demand_estimator_interface_1 = require("./interfaces/demand-estimator.interface");
const demand_aggregator_interface_1 = require("./interfaces/demand-aggregator.interface");
const demand_event_publisher_1 = require("./events/demand-event.publisher");
const demand_analytics_service_1 = require("./services/demand-analytics.service");
const yield_rule_utils_1 = require("../yield-intelligence/utils/yield-rule.utils");
const MSP_CROP_KEYWORDS = [
    'rice', 'paddy', 'wheat', 'jowar', 'bajra', 'maize', 'ragi', 'barley',
    'gram', 'tur', 'moong', 'urad', 'lentil', 'groundnut', 'sunflower',
    'soybean', 'rapeseed', 'mustard', 'cotton', 'jute', 'sugarcane',
];
const EXPORT_CROP_KEYWORDS = [
    'rice', 'basmati', 'onion', 'mango', 'banana', 'grapes', 'pomegranate',
    'cotton', 'castor', 'cumin', 'turmeric', 'chilli', 'pepper', 'guar',
    'sesame', 'groundnut', 'soybean',
];
let DemandIntelligenceService = DemandIntelligenceService_1 = class DemandIntelligenceService {
    dataSource;
    weatherService;
    geoBoundaryService;
    harvestMongoService;
    yieldMongoService;
    supplyMongoService;
    demandMongoService;
    marketRepository;
    eventPublisher;
    regionalService;
    analyticsService;
    demandEstimator;
    logger = new common_1.Logger(DemandIntelligenceService_1.name);
    constructor(dataSource, weatherService, geoBoundaryService, harvestMongoService, yieldMongoService, supplyMongoService, demandMongoService, marketRepository, eventPublisher, regionalService, analyticsService, demandEstimator) {
        this.dataSource = dataSource;
        this.weatherService = weatherService;
        this.geoBoundaryService = geoBoundaryService;
        this.harvestMongoService = harvestMongoService;
        this.yieldMongoService = yieldMongoService;
        this.supplyMongoService = supplyMongoService;
        this.demandMongoService = demandMongoService;
        this.marketRepository = marketRepository;
        this.eventPublisher = eventPublisher;
        this.regionalService = regionalService;
        this.analyticsService = analyticsService;
        this.demandEstimator = demandEstimator;
    }
    async assess(farmerCropId, userId) {
        this.logger.debug(`Starting demand assessment | farmerCropId=${farmerCropId}`);
        const context = await this.loadAssessmentContext(farmerCropId, userId);
        const previous = await this.demandMongoService.findByFarmerCropId(farmerCropId);
        const result = this.demandEstimator.estimate(context);
        result.version = (previous?.version ?? 0) + 1;
        result.assessedAt = new Date();
        await this.demandMongoService.upsertAssessment(farmerCropId, {
            ...result,
            regionLevel: result.regionLevel,
            regionName: result.regionName,
            villageName: result.villageName ?? undefined,
            talukName: result.talukName ?? undefined,
            districtName: result.districtName ?? undefined,
            stateName: result.stateName ?? undefined,
            riskLevel: result.risk.level,
            riskScore: result.risk.score,
            riskReasons: result.risk.reasons,
            mitigationRecommendations: result.risk.mitigationRecommendations,
            seasonalAnalysis: result.seasonalAnalysis,
            timeline: result.timeline,
            recommendations: result.recommendations,
            confidenceBand: result.confidenceBand,
            explanations: result.explanations,
        });
        await this.demandMongoService.appendHistory({
            farmerCropId,
            farmerProfileId: result.farmerProfileId,
            cropName: result.cropName,
            previousDemandKg: previous?.currentDemandKg,
            newDemandKg: result.currentDemandKg,
            reason: previous ? 'scheduled-reassessment' : 'initial-assessment',
            confidence: result.confidence,
            riskLevel: result.risk.level,
            demandDensityKgPerAcre: result.demandDensityKgPerAcre,
            explanations: result.explanations,
            recommendations: result.recommendations,
            version: result.version,
        });
        this.eventPublisher.publishPredicted(result);
        if (previous && previous.currentDemandKg !== result.currentDemandKg) {
            this.eventPublisher.publishUpdated(result, previous.currentDemandKg ?? 0);
        }
        if (result.risk.level === 'high' || result.risk.level === 'critical') {
            this.eventPublisher.publishWarning(result);
        }
        this.logger.log(`Demand assessment complete | farmerCropId=${farmerCropId} current=${result.currentDemandKg}kg expected=${result.expectedDemandKg}kg confidence=${result.confidence}% risk=${result.risk.level}`);
        return result;
    }
    async getAssessment(farmerCropId, userId) {
        await this.loadCropData(farmerCropId, userId);
        const doc = await this.demandMongoService.findByFarmerCropId(farmerCropId);
        if (!doc)
            return this.assess(farmerCropId, userId);
        return doc;
    }
    async getMyAssessments(userId) {
        const profileId = await this.resolveProfileId(userId);
        if (!profileId)
            return [];
        const docs = await this.demandMongoService.findByFarmerProfileId(String(profileId));
        if (docs.length > 0)
            return docs;
        await this.runBulkAssessment(userId);
        return this.demandMongoService.findByFarmerProfileId(String(profileId));
    }
    async getSummary(userId) {
        return this.getMyAssessments(userId);
    }
    async getRisk(farmerCropId, userId) {
        if (farmerCropId && userId) {
            const doc = await this.getAssessment(farmerCropId, userId);
            return {
                farmerCropId,
                cropName: doc.cropName,
                riskLevel: doc.risk?.level ?? doc.riskLevel,
                riskScore: doc.risk?.score ?? doc.riskScore,
                reasons: doc.risk?.reasons ?? doc.riskReasons ?? [],
                mitigationRecommendations: doc.risk?.mitigationRecommendations ?? doc.mitigationRecommendations ?? [],
                explanations: doc.explanations?.slice(0, 3) ?? [],
            };
        }
        const docs = userId ? await this.getMyAssessments(userId) : await this.demandMongoService.findAllPredictions();
        const worst = [...docs].sort((a, b) => (b.riskScore ?? 0) - (a.riskScore ?? 0))[0];
        return {
            riskLevel: worst?.riskLevel ?? 'low',
            riskScore: worst?.riskScore ?? 0,
            reasons: worst?.riskReasons ?? [],
            mitigationRecommendations: worst?.mitigationRecommendations ?? [],
            explanations: worst?.explanations?.slice(0, 3) ?? [],
            totalAssessments: docs.length,
        };
    }
    async getTimeline(farmerCropId, userId) {
        if (farmerCropId && userId) {
            const doc = await this.getAssessment(farmerCropId, userId);
            return doc.timeline ?? [];
        }
        const docs = userId ? await this.getMyAssessments(userId) : await this.demandMongoService.findAllPredictions();
        return docs.flatMap((doc) => (doc.timeline ?? []).map((point) => ({ ...point, farmerCropId: doc.farmerCropId, cropName: doc.cropName })));
    }
    async getRegional(level, name) {
        const validLevels = ['village', 'taluk', 'district', 'state'];
        if (!validLevels.includes(level)) {
            throw new common_1.BadRequestException(`regionLevel must be one of: ${validLevels.join(', ')}`);
        }
        return this.regionalService.getRegionalSummary(level, name);
    }
    async getAnalytics(regionLevel, regionName, periodType, limit) {
        const analytics = await this.analyticsService.getAnalytics(regionLevel, regionName, periodType, limit);
        if (analytics.length === 0) {
            await this.analyticsService.refreshGlobalAnalytics();
            return this.analyticsService.getAnalytics(regionLevel, regionName, periodType, limit);
        }
        return analytics;
    }
    async refreshAnalytics() {
        await this.analyticsService.refreshRegionalAnalytics();
        return this.analyticsService.refreshGlobalAnalytics();
    }
    async runBulkAssessment(userId) {
        this.logger.log(`Bulk demand assessment started${userId ? ` for user=${userId}` : ''}`);
        const activeRows = await this.loadActiveRows(userId);
        let assessed = 0;
        let failed = 0;
        for (const row of activeRows) {
            try {
                await this.assess(String(row.farmer_crop_id), String(row.user_id));
                assessed++;
            }
            catch (error) {
                failed++;
                this.logger.warn(`Demand assessment failed for farmerCropId=${row.farmer_crop_id}: ${error?.message}`);
            }
        }
        this.logger.log(`Bulk demand assessment complete | assessed=${assessed} failed=${failed}`);
        return { assessed, failed };
    }
    async loadAssessmentContext(farmerCropId, userId) {
        const cropData = await this.loadCropData(farmerCropId, userId);
        if (!cropData)
            throw new common_1.NotFoundException(`Farmer crop ${farmerCropId} not found or access denied`);
        if (!cropData.sowing_date)
            throw new common_1.BadRequestException('Sowing date must be set before demand assessment can run');
        const harvestAssessment = await this.harvestMongoService.findByFarmerCropId(farmerCropId);
        const yieldAssessment = await this.yieldMongoService.findByFarmerCropId(farmerCropId);
        const supplyAssessment = await this.supplyMongoService.findByFarmerCropId(farmerCropId);
        const weather = await this.buildWeatherContext(cropData.parcel_id, userId);
        const lifecycle = this.buildLifecycleContext(cropData);
        const geography = await this.resolveRegionHierarchy(cropData);
        const marketContext = await this.buildMarketContext(cropData.crop_name);
        const historicalDemand = await this.loadHistoricalDemand(farmerCropId);
        const cropLower = (0, yield_rule_utils_1.lower)(cropData.crop_name ?? '');
        const isMspCrop = MSP_CROP_KEYWORDS.some((kw) => cropLower.includes(kw));
        const isExportCrop = EXPORT_CROP_KEYWORDS.some((kw) => cropLower.includes(kw));
        const regionalEventNotes = [
            ...(weather.hasFloodRisk ? ['Flood risk may disrupt supply movement to demand centres'] : []),
            ...(weather.hasHeatStress ? ['Heat stress may reduce marketable harvest quality'] : []),
        ];
        return {
            farmerCropId,
            farmerProfileId: String(cropData.farmer_profile_id),
            cropName: cropData.crop_name,
            cropVariety: cropData.crop_variety ?? null,
            cropCategory: cropData.crop_category ?? null,
            cropSeason: cropData.season ?? null,
            regionLevel: geography.regionLevel,
            regionName: geography.regionName,
            villageName: geography.villageName,
            talukName: geography.talukName,
            districtName: geography.districtName,
            stateName: geography.stateName,
            areaAcres: (0, yield_rule_utils_1.safeNumber)(cropData.area_acres, cropData.total_land_area ?? 1),
            expectedHarvestDate: cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null,
            harvestReadinessScore: (0, yield_rule_utils_1.safeNumber)(harvestAssessment?.readinessScore, 0),
            harvestRiskLevel: harvestAssessment?.riskLevel ?? 'low',
            harvestStage: harvestAssessment?.readinessStatus ?? lifecycle.lifecycleStage,
            yieldExpectedKg: (0, yield_rule_utils_1.safeNumber)(yieldAssessment?.expectedYieldKg ?? cropData.estimated_yield_kg ?? harvestAssessment?.expectedYieldKg, 0),
            yieldConfidence: (0, yield_rule_utils_1.safeNumber)(yieldAssessment?.confidence ?? harvestAssessment?.yieldConfidence, 60),
            yieldRiskLevel: String(yieldAssessment?.risk?.level ?? yieldAssessment?.riskLevel ?? 'low'),
            availableSupplyKg: (0, yield_rule_utils_1.safeNumber)(supplyAssessment?.availableSupplyKg, 0),
            expectedSupplyKg: (0, yield_rule_utils_1.safeNumber)(supplyAssessment?.expectedSupplyKg, 0),
            supplyRiskLevel: String(supplyAssessment?.riskLevel ?? 'low'),
            supplyDensityKgPerAcre: (0, yield_rule_utils_1.safeNumber)(supplyAssessment?.supplyDensityKgPerAcre, 0),
            marketModalPrice: marketContext.modalPrice,
            marketMinPrice: marketContext.minPrice,
            marketMaxPrice: marketContext.maxPrice,
            marketTrendDirection: marketContext.trendDirection,
            recentArrivalQty: marketContext.recentArrivalQty,
            weather,
            lifecycle,
            isMspCrop,
            isExportCrop,
            currentMonth: new Date().getMonth() + 1,
            historicalDemandKg: historicalDemand,
            regionalEventNotes,
        };
    }
    async buildMarketContext(cropName) {
        try {
            const prices = await this.marketRepository.findPrices(cropName, undefined, undefined, undefined, 10);
            const arrivals = await this.marketRepository.findArrivals(cropName, undefined, undefined, undefined, 5);
            if (!prices.length) {
                return { modalPrice: 0, minPrice: 0, maxPrice: 0, trendDirection: 'stable', recentArrivalQty: 0 };
            }
            const latestPrice = prices[0];
            const modalPrice = (0, yield_rule_utils_1.safeNumber)(latestPrice.modalPrice, 0);
            const minPrice = (0, yield_rule_utils_1.safeNumber)(latestPrice.minPrice, 0);
            const maxPrice = (0, yield_rule_utils_1.safeNumber)(latestPrice.maxPrice, 0);
            const recentArrivalQty = arrivals.reduce((sum, a) => sum + (0, yield_rule_utils_1.safeNumber)(a.arrivalQty, 0), 0);
            let trendDirection = 'stable';
            if (prices.length >= 2) {
                const newest = (0, yield_rule_utils_1.safeNumber)(prices[0].modalPrice, 0);
                const oldest = (0, yield_rule_utils_1.safeNumber)(prices[prices.length - 1].modalPrice, 0);
                const diff = newest - oldest;
                if (diff > oldest * 0.05)
                    trendDirection = 'rising';
                else if (diff < -(oldest * 0.05))
                    trendDirection = 'falling';
            }
            return { modalPrice, minPrice, maxPrice, trendDirection, recentArrivalQty };
        }
        catch {
            return { modalPrice: 0, minPrice: 0, maxPrice: 0, trendDirection: 'stable', recentArrivalQty: 0 };
        }
    }
    buildLifecycleContext(cropData) {
        const sowingDate = new Date(cropData.sowing_date);
        const durationDays = cropData.duration_days ?? 90;
        const expectedHarvestDate = cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null;
        const daysElapsed = Math.max(0, Math.floor((Date.now() - sowingDate.getTime()) / (24 * 60 * 60 * 1000)));
        const daysRemaining = expectedHarvestDate
            ? Math.max(0, Math.ceil((expectedHarvestDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
            : Math.max(0, durationDays - daysElapsed);
        const growthPercentage = durationDays > 0 ? Math.min(100, Math.round((daysElapsed / durationDays) * 100)) : 0;
        const lifecycleStage = growthPercentage >= 90 ? 'ready' : growthPercentage >= 60 ? 'ripening' : growthPercentage >= 35 ? 'reproductive' : growthPercentage > 0 ? 'vegetative' : 'pre-sowing';
        return { sowingDate, durationDays, expectedHarvestDate, daysElapsed, daysRemaining, growthPercentage, lifecycleStage };
    }
    async buildWeatherContext(parcelId, userId) {
        try {
            const current = await this.weatherService.getCurrentWeather(parcelId, userId);
            return {
                currentTemperature: current.temperature,
                currentHumidity: current.humidity,
                currentRainfall: current.rainfall,
                forecastRainProbability: current.rainfall > 5 ? 70 : 20,
                forecastTemperature: current.temperature,
                weatherCondition: current.weatherCondition,
                hasRainForecast: current.rainfall > 5,
                hasHeatStress: current.temperature >= 38,
                hasColdStress: current.temperature <= 10,
                hasFloodRisk: current.rainfall >= 45,
            };
        }
        catch {
            return { hasRainForecast: false, hasHeatStress: false, hasColdStress: false, hasFloodRisk: false, forecastRainProbability: 20 };
        }
    }
    async resolveRegionHierarchy(cropData) {
        const region = {
            regionLevel: 'district',
            regionName: cropData.district ?? cropData.state ?? 'unknown',
            villageName: cropData.village ?? null,
            talukName: null,
            districtName: cropData.district ?? null,
            stateName: cropData.state ?? null,
        };
        const latitude = cropData.latitude !== null ? Number(cropData.latitude) : null;
        const longitude = cropData.longitude !== null ? Number(cropData.longitude) : null;
        if (latitude !== null && longitude !== null) {
            try {
                const resolved = await this.geoBoundaryService.resolveLocation(latitude, longitude);
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
    async loadCropData(farmerCropId, userId) {
        const rows = await this.dataSource.query(`SELECT
         fc.id, fc.sowing_date, fc.expected_harvest_date, fc.estimated_yield_kg,
         fc.actual_yield_kg, fc.status, fc.crop_variety, fc.parcel_id, fc.crop_id,
         c.crop_name, c.crop_category, c.season, c.duration_days,
         c.ideal_temperature_min, c.ideal_temperature_max, c.water_requirement,
         flp.area_acres, flp.soil_type, flp.land_type, flp.irrigation_type,
         ST_X(flp.location::geometry) AS longitude,
         ST_Y(flp.location::geometry) AS latitude,
         fp.id AS farmer_profile_id, fp.user_id, fp.district, fp.state, fp.village,
         fp.total_land_area, fp.primary_soil_type, fp.primary_irrigation_type
       FROM farmer_crops fc
       JOIN crops c ON c.id = fc.crop_id
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       JOIN users u ON u.id = fp.user_id
       WHERE fc.id = $1 AND u.id = $2`, [farmerCropId, userId]);
        return rows[0] ?? null;
    }
    async loadActiveRows(userId) {
        const params = [];
        let userFilter = '';
        if (userId) {
            params.push(userId);
            userFilter = 'AND u.id = $1';
        }
        return this.dataSource.query(`SELECT fc.id AS farmer_crop_id, fp.user_id
       FROM farmer_crops fc
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       JOIN users u ON u.id = fp.user_id
       WHERE fc.status = 'active' AND fc.sowing_date IS NOT NULL ${userFilter}`, params);
    }
    async loadHistoricalDemand(farmerCropId) {
        const rows = await this.demandMongoService.findHistory(farmerCropId, 10);
        return rows.map((row) => (0, yield_rule_utils_1.safeNumber)(row.newDemandKg, 0)).filter((v) => v > 0);
    }
    async resolveProfileId(userId) {
        const rows = await this.dataSource.query(`SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
        return rows[0]?.id ?? null;
    }
};
exports.DemandIntelligenceService = DemandIntelligenceService;
exports.DemandIntelligenceService = DemandIntelligenceService = DemandIntelligenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(9, (0, common_1.Inject)(demand_aggregator_interface_1.DEMAND_AGGREGATOR)),
    __param(11, (0, common_1.Inject)(demand_estimator_interface_1.DEMAND_ESTIMATOR)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        weather_service_1.WeatherService,
        geoboundary_service_1.GeoBoundaryService,
        harvest_mongo_service_1.HarvestMongoService,
        yield_mongo_service_1.YieldMongoService,
        supply_mongo_service_1.SupplyMongoService,
        demand_mongo_service_1.DemandMongoService,
        market_repository_1.MarketRepository,
        demand_event_publisher_1.DemandEventPublisher, Object, demand_analytics_service_1.DemandAnalyticsService, Object])
], DemandIntelligenceService);
//# sourceMappingURL=demand-intelligence.service.js.map