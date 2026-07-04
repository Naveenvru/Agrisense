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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestEstimatorEngine = void 0;
const common_1 = require("@nestjs/common");
const harvest_quality_assessor_engine_1 = require("./harvest-quality-assessor.engine");
const harvest_labour_estimator_engine_1 = require("./harvest-labour-estimator.engine");
const harvest_equipment_recommender_engine_1 = require("./harvest-equipment-recommender.engine");
const harvest_storage_advisor_engine_1 = require("./harvest-storage-advisor.engine");
let HarvestEstimatorEngine = class HarvestEstimatorEngine {
    qualityAssessor;
    labourEstimator;
    equipmentRecommender;
    storageAdvisor;
    constructor(qualityAssessor, labourEstimator, equipmentRecommender, storageAdvisor) {
        this.qualityAssessor = qualityAssessor;
        this.labourEstimator = labourEstimator;
        this.equipmentRecommender = equipmentRecommender;
        this.storageAdvisor = storageAdvisor;
    }
    estimateYield(estimatedYieldKg, areaAcres, lifecycle, activities) {
        let baseYield = estimatedYieldKg ?? (areaAcres ? areaAcres * 1500 : 1000);
        const activityMultiplier = 0.7 + (activities.completionRate / 100) * 0.3;
        const adjustedYield = Math.round(baseYield * activityMultiplier);
        let confidence = 50;
        if (estimatedYieldKg)
            confidence += 25;
        if (lifecycle.growthPercentage > 70)
            confidence += 15;
        if (activities.completionRate > 70)
            confidence += 10;
        confidence = Math.min(90, confidence);
        const explanation = estimatedYieldKg
            ? `Based on farmer estimate of ${estimatedYieldKg} kg, adjusted by activity completion rate (${activities.completionRate.toFixed(0)}%)`
            : `Estimated from ${areaAcres ?? '?'} acres at ~1500 kg/acre, adjusted by farm activity completion`;
        return { expectedYieldKg: adjustedYield, yieldConfidence: confidence, explanation };
    }
    estimateQuality(weather, activities, cropVariety, lifecycle) {
        return this.qualityAssessor.assessQuality(weather, activities, cropVariety, lifecycle);
    }
    estimateLabour(areaAcres, cropName, harvestWindow) {
        return this.labourEstimator.estimateLabour(areaAcres, cropName, harvestWindow.optimalHarvestDate);
    }
    recommendEquipment(cropName, areaAcres, qualityGrade) {
        return this.equipmentRecommender.recommendEquipment(cropName, areaAcres, qualityGrade);
    }
    recommendStorage(qualityGrade, lifecycle, weather) {
        return this.storageAdvisor.recommendStorage(qualityGrade, lifecycle, weather);
    }
};
exports.HarvestEstimatorEngine = HarvestEstimatorEngine;
exports.HarvestEstimatorEngine = HarvestEstimatorEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [harvest_quality_assessor_engine_1.HarvestQualityAssessorEngine,
        harvest_labour_estimator_engine_1.HarvestLabourEstimatorEngine,
        harvest_equipment_recommender_engine_1.HarvestEquipmentRecommenderEngine,
        harvest_storage_advisor_engine_1.HarvestStorageAdvisorEngine])
], HarvestEstimatorEngine);
//# sourceMappingURL=harvest-estimator.engine.js.map