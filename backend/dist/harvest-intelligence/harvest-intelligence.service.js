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
var HarvestIntelligenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestIntelligenceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const harvest_mongo_service_1 = require("../mongodb/harvest/harvest-mongo.service");
const crop_lifecycle_engine_1 = require("./engines/crop-lifecycle.engine");
const harvest_assessment_engine_1 = require("./engines/harvest-assessment.engine");
const harvest_estimator_engine_1 = require("./engines/harvest-estimator.engine");
const harvest_event_publisher_1 = require("./events/harvest-event.publisher");
const regional_harvest_service_1 = require("./regional/regional-harvest.service");
let HarvestIntelligenceService = HarvestIntelligenceService_1 = class HarvestIntelligenceService {
    dataSource;
    mongoService;
    lifecycleEngine;
    assessmentEngine;
    estimatorEngine;
    eventPublisher;
    regionalService;
    logger = new common_1.Logger(HarvestIntelligenceService_1.name);
    constructor(dataSource, mongoService, lifecycleEngine, assessmentEngine, estimatorEngine, eventPublisher, regionalService) {
        this.dataSource = dataSource;
        this.mongoService = mongoService;
        this.lifecycleEngine = lifecycleEngine;
        this.assessmentEngine = assessmentEngine;
        this.estimatorEngine = estimatorEngine;
        this.eventPublisher = eventPublisher;
        this.regionalService = regionalService;
    }
    async assess(farmerCropId, userId) {
        this.logger.debug(`Starting assessment | farmerCropId=${farmerCropId}`);
        const cropData = await this.loadCropData(farmerCropId, userId);
        if (!cropData) {
            throw new common_1.NotFoundException(`Farmer crop ${farmerCropId} not found or access denied`);
        }
        if (!cropData.sowing_date) {
            throw new common_1.BadRequestException('Sowing date must be set before harvest assessment can run');
        }
        const lifecycle = this.lifecycleEngine.compute(new Date(cropData.sowing_date), cropData.duration_days ?? 90, cropData.expected_harvest_date ? new Date(cropData.expected_harvest_date) : null);
        const weather = await this.buildWeatherContext(cropData.parcel_id);
        const activities = await this.buildActivityContext(farmerCropId);
        const assessment = this.assessmentEngine.evaluate(lifecycle, weather, activities, cropData.ideal_temperature_min, cropData.ideal_temperature_max);
        const yieldEstimate = this.estimatorEngine.estimateYield(cropData.estimated_yield_kg, cropData.area_acres, lifecycle, activities);
        const qualityEstimate = this.estimatorEngine.estimateQuality(weather, activities, cropData.crop_variety, lifecycle);
        const labourEstimate = this.estimatorEngine.estimateLabour(cropData.area_acres, cropData.crop_name, assessment.harvestWindow);
        const equipmentRec = this.estimatorEngine.recommendEquipment(cropData.crop_name, cropData.area_acres, qualityEstimate.grade);
        const storageAdvice = this.estimatorEngine.recommendStorage(qualityEstimate.grade, lifecycle, weather);
        const allExplanations = [
            ...assessment.explanations,
            yieldEstimate.explanation,
            qualityEstimate.explanation,
            labourEstimate.explanation,
            equipmentRec.explanation,
            storageAdvice.explanation,
        ];
        const resultDoc = {
            farmerCropId,
            farmerProfileId: String(cropData.farmer_profile_id),
            cropName: cropData.crop_name,
            cropVariety: cropData.crop_variety ?? undefined,
            daysElapsed: lifecycle.daysElapsed,
            daysRemaining: lifecycle.daysRemaining,
            growthPercentage: lifecycle.growthPercentage,
            lifecycleStage: lifecycle.lifecycleStage,
            readinessScore: assessment.readinessScore,
            readinessStatus: assessment.readinessStatus,
            earliestHarvestDate: assessment.harvestWindow.earliestHarvestDate,
            optimalHarvestDate: assessment.harvestWindow.optimalHarvestDate,
            latestSafeHarvestDate: assessment.harvestWindow.latestSafeHarvestDate,
            harvestScore: assessment.harvestScore,
            confidenceScore: assessment.confidenceScore,
            riskLevel: assessment.riskLevel,
            riskFactors: assessment.riskFactors,
            mitigationRecommendations: assessment.mitigationRecommendations,
            delayDays: assessment.harvestDelay.delayDays,
            delayReasons: assessment.harvestDelay.delayReasons,
            delayActions: assessment.harvestDelay.suggestedActions,
            expectedYieldKg: yieldEstimate.expectedYieldKg,
            yieldConfidence: yieldEstimate.yieldConfidence,
            qualityGrade: qualityEstimate.grade,
            qualityExplanation: qualityEstimate.explanation,
            workersRequired: labourEstimate.workersRequired,
            harvestDurationDays: labourEstimate.harvestDurationDays,
            estimatedLabourHours: labourEstimate.estimatedLabourHours,
            equipmentRecommendations: equipmentRec.recommended,
            storageRecommendation: storageAdvice.recommendation,
            storageExplanation: storageAdvice.explanation,
            explanations: allExplanations,
        };
        const previous = await this.mongoService.findByFarmerCropId(farmerCropId);
        const previousReadiness = previous?.readinessScore;
        await this.mongoService.upsertAssessment(farmerCropId, resultDoc);
        await this.mongoService.appendHistory({
            farmerCropId,
            farmerProfileId: resultDoc.farmerProfileId,
            cropName: cropData.crop_name,
            previousHarvestDate: previous?.optimalHarvestDate,
            newHarvestDate: assessment.harvestWindow.optimalHarvestDate,
            reason: previous ? 'scheduled-reassessment' : 'initial-assessment',
            readinessScore: assessment.readinessScore,
            harvestScore: assessment.harvestScore,
            confidenceScore: assessment.confidenceScore,
            riskLevel: assessment.riskLevel,
            delayDays: assessment.harvestDelay.delayDays,
            explanations: allExplanations,
            version: (previous?.version ?? 0) + 1,
        });
        await this.eventPublisher.publishPredicted({
            farmerCropId,
            farmerProfileId: resultDoc.farmerProfileId,
            cropName: cropData.crop_name,
            readinessScore: assessment.readinessScore,
            harvestScore: assessment.harvestScore,
            confidenceScore: assessment.confidenceScore,
            optimalHarvestDate: assessment.harvestWindow.optimalHarvestDate,
        });
        if (previousReadiness !== undefined && assessment.readinessScore !== previousReadiness) {
            await this.eventPublisher.publishUpdated({
                farmerCropId,
                farmerProfileId: resultDoc.farmerProfileId,
                previousReadiness,
                newReadiness: assessment.readinessScore,
                reason: 'daily-reassessment',
            });
        }
        if (assessment.harvestDelay.hasDelay) {
            await this.eventPublisher.publishDelayed({
                farmerCropId,
                farmerProfileId: resultDoc.farmerProfileId,
                cropName: cropData.crop_name,
                delayDays: assessment.harvestDelay.delayDays,
                delayReasons: assessment.harvestDelay.delayReasons,
            });
        }
        if (['ready', 'almost-ready'].includes(assessment.readinessStatus)) {
            await this.eventPublisher.publishReadinessAlert({
                farmerCropId,
                farmerProfileId: resultDoc.farmerProfileId,
                cropName: cropData.crop_name,
                readinessStatus: assessment.readinessStatus,
                readinessScore: assessment.readinessScore,
                recommendation: assessment.mitigationRecommendations[0] ?? 'Prepare for harvest',
            });
        }
        this.logger.log(`Assessment complete | farmerCropId=${farmerCropId} readiness=${assessment.readinessScore}% score=${assessment.harvestScore} confidence=${assessment.confidenceScore}%`);
        return resultDoc;
    }
    async getAssessment(farmerCropId, userId) {
        await this.loadCropData(farmerCropId, userId);
        const doc = await this.mongoService.findByFarmerCropId(farmerCropId);
        if (!doc) {
            return this.assess(farmerCropId, userId);
        }
        return doc;
    }
    async getMyAssessments(userId) {
        const profileId = await this.resolveProfileId(userId);
        if (!profileId)
            return [];
        return this.mongoService.findByFarmerProfileId(String(profileId));
    }
    async getReadiness(farmerCropId, userId) {
        const doc = await this.getAssessment(farmerCropId, userId);
        return {
            farmerCropId,
            cropName: doc.cropName,
            readinessScore: doc.readinessScore,
            readinessStatus: doc.readinessStatus,
            daysRemaining: doc.daysRemaining,
            lifecycleStage: doc.lifecycleStage,
            explanations: doc.explanations?.slice(0, 3) ?? [],
            assessedAt: doc.assessedAt,
        };
    }
    async getWindow(farmerCropId, userId) {
        const doc = await this.getAssessment(farmerCropId, userId);
        return {
            farmerCropId,
            cropName: doc.cropName,
            earliestHarvestDate: doc.earliestHarvestDate,
            optimalHarvestDate: doc.optimalHarvestDate,
            latestSafeHarvestDate: doc.latestSafeHarvestDate,
            delayDays: doc.delayDays,
            delayReasons: doc.delayReasons,
            explanations: doc.explanations?.slice(0, 2) ?? [],
        };
    }
    async getRisk(farmerCropId, userId) {
        const doc = await this.getAssessment(farmerCropId, userId);
        return {
            farmerCropId,
            cropName: doc.cropName,
            riskLevel: doc.riskLevel,
            riskFactors: doc.riskFactors,
            mitigationRecommendations: doc.mitigationRecommendations,
            confidenceScore: doc.confidenceScore,
        };
    }
    async getHistory(farmerCropId, userId, limit = 20) {
        await this.loadCropData(farmerCropId, userId);
        return this.mongoService.findHistory(farmerCropId, limit);
    }
    async getEstimate(farmerCropId, userId) {
        const doc = await this.getAssessment(farmerCropId, userId);
        return {
            farmerCropId,
            cropName: doc.cropName,
            expectedYieldKg: doc.expectedYieldKg,
            yieldConfidence: doc.yieldConfidence,
            qualityGrade: doc.qualityGrade,
            qualityExplanation: doc.qualityExplanation,
            workersRequired: doc.workersRequired,
            harvestDurationDays: doc.harvestDurationDays,
            estimatedLabourHours: doc.estimatedLabourHours,
            equipmentRecommendations: doc.equipmentRecommendations,
            storageRecommendation: doc.storageRecommendation,
            storageExplanation: doc.storageExplanation,
        };
    }
    async getAnalytics(regionLevel, regionName, periodType, limit) {
        return this.mongoService.findAnalytics(regionLevel, regionName, periodType, limit);
    }
    async getRegional(level, name) {
        const validLevels = ['village', 'taluk', 'district', 'state'];
        if (!validLevels.includes(level)) {
            throw new common_1.BadRequestException(`regionLevel must be one of: ${validLevels.join(', ')}`);
        }
        return this.regionalService.getRegionalSummary(level, name);
    }
    async runBulkAssessment() {
        this.logger.log('Bulk harvest assessment started');
        const activeRows = await this.dataSource.query(`SELECT fc.id AS farmer_crop_id, fp.user_id
       FROM farmer_crops fc
       JOIN farmer_land_parcels flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles fp ON fp.id = flp.farmer_profile_id
       WHERE fc.status = 'active' AND fc.sowing_date IS NOT NULL`);
        let assessed = 0;
        let failed = 0;
        for (const row of activeRows) {
            try {
                await this.assess(String(row.farmer_crop_id), String(row.user_id));
                assessed++;
            }
            catch (err) {
                failed++;
                this.logger.warn(`Assessment failed for farmerCropId=${row.farmer_crop_id}: ${err?.message}`);
            }
        }
        this.logger.log(`Bulk assessment complete | assessed=${assessed} failed=${failed}`);
        return { assessed, failed };
    }
    async loadCropData(farmerCropId, userId) {
        const rows = await this.dataSource.query(`SELECT
         fc.id,
         fc.sowing_date,
         fc.expected_harvest_date,
         fc.estimated_yield_kg,
         fc.actual_yield_kg,
         fc.status,
         fc.crop_variety,
         fc.parcel_id,
         c.crop_name,
         c.duration_days,
         c.ideal_temperature_min,
         c.ideal_temperature_max,
         c.water_requirement,
         flp.area_acres,
         fp.id AS farmer_profile_id,
         fp.user_id,
         fp.district,
         fp.state
       FROM farmer_crops          fc
       JOIN crops                 c   ON c.id   = fc.crop_id
       JOIN farmer_land_parcels   flp ON flp.id = fc.parcel_id
       JOIN farmer_profiles       fp  ON fp.id  = flp.farmer_profile_id
       JOIN users                 u   ON u.id   = fp.user_id
       WHERE fc.id = $1 AND u.id = $2`, [farmerCropId, userId]);
        return rows[0] ?? null;
    }
    async buildWeatherContext(parcelId) {
        try {
            const rows = await this.dataSource.query(`SELECT temperature, humidity, rainfall, weather_condition, wind_speed
         FROM weather_history
         WHERE location_id IN (
           SELECT CONCAT(
             ROUND(CAST(ST_Y(location::geometry) AS NUMERIC), 4)::text, '_',
             ROUND(CAST(ST_X(location::geometry) AS NUMERIC), 4)::text
           )
           FROM farmer_land_parcels WHERE id = $1
         )
         ORDER BY timestamp DESC LIMIT 1`, [parcelId]);
            if (!rows.length)
                return this.defaultWeatherContext();
            const w = rows[0];
            const temp = parseFloat(w.temperature ?? '25');
            const rain = parseFloat(w.rainfall ?? '0');
            return {
                currentTemperature: temp,
                currentHumidity: parseFloat(w.humidity ?? '60'),
                currentRainfall: rain,
                weatherCondition: w.weather_condition ?? '',
                hasRainForecast: rain > 5,
                hasHeatStress: temp > 38,
                hasColdStress: temp < 10,
                hasFloodRisk: rain > 50,
                forecastRainProbability: rain > 5 ? 70 : 20,
                forecastTemperature: temp,
            };
        }
        catch {
            return this.defaultWeatherContext();
        }
    }
    defaultWeatherContext() {
        return {
            hasRainForecast: false,
            hasHeatStress: false,
            hasColdStress: false,
            hasFloodRisk: false,
            forecastRainProbability: 20,
        };
    }
    async buildActivityContext(farmerCropId) {
        try {
            const rows = await this.dataSource.query(`SELECT
           COUNT(*) AS total,
           SUM(CASE WHEN is_completed THEN 1 ELSE 0 END) AS completed,
           SUM(CASE WHEN NOT is_completed THEN 1 ELSE 0 END) AS pending,
           SUM(CASE WHEN NOT is_completed AND event_date < NOW() THEN 1 ELSE 0 END) AS overdue,
           SUM(CASE WHEN task_name ILIKE '%irrigat%' AND NOT is_completed AND event_date < NOW() THEN 1 ELSE 0 END) AS late_irrigation,
           SUM(CASE WHEN task_name ILIKE '%fertiliz%' AND NOT is_completed AND event_date < NOW() THEN 1 ELSE 0 END) AS late_fertilizer
         FROM calendar_events
         WHERE farmer_crop_id = $1`, [farmerCropId]);
            const r = rows[0];
            const total = parseInt(r.total ?? '0', 10);
            const completed = parseInt(r.completed ?? '0', 10);
            const pending = parseInt(r.pending ?? '0', 10);
            const overdue = parseInt(r.overdue ?? '0', 10);
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;
            return {
                totalEvents: total,
                completedEvents: completed,
                pendingEvents: pending,
                overduePendingEvents: overdue,
                completionRate,
                hasLateIrrigation: parseInt(r.late_irrigation ?? '0', 10) > 0,
                hasLateFertilizer: parseInt(r.late_fertilizer ?? '0', 10) > 0,
                hasMissedActivities: overdue > 0,
            };
        }
        catch {
            return {
                totalEvents: 0, completedEvents: 0, pendingEvents: 0,
                overduePendingEvents: 0, completionRate: 100,
                hasLateIrrigation: false, hasLateFertilizer: false, hasMissedActivities: false,
            };
        }
    }
    async resolveProfileId(userId) {
        const rows = await this.dataSource.query(`SELECT id FROM farmer_profiles WHERE user_id = $1 LIMIT 1`, [userId]);
        return rows[0]?.id ?? null;
    }
};
exports.HarvestIntelligenceService = HarvestIntelligenceService;
exports.HarvestIntelligenceService = HarvestIntelligenceService = HarvestIntelligenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        harvest_mongo_service_1.HarvestMongoService,
        crop_lifecycle_engine_1.CropLifecycleEngine,
        harvest_assessment_engine_1.HarvestAssessmentEngine,
        harvest_estimator_engine_1.HarvestEstimatorEngine,
        harvest_event_publisher_1.HarvestEventPublisher,
        regional_harvest_service_1.RegionalHarvestService])
], HarvestIntelligenceService);
//# sourceMappingURL=harvest-intelligence.service.js.map