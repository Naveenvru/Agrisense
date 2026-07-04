"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestIntelligenceModule = void 0;
const common_1 = require("@nestjs/common");
const harvest_intelligence_controller_1 = require("./harvest-intelligence.controller");
const harvest_intelligence_service_1 = require("./harvest-intelligence.service");
const crop_lifecycle_engine_1 = require("./engines/crop-lifecycle.engine");
const harvest_assessment_engine_1 = require("./engines/harvest-assessment.engine");
const harvest_estimator_engine_1 = require("./engines/harvest-estimator.engine");
const harvest_risk_analyzer_engine_1 = require("./engines/harvest-risk-analyzer.engine");
const harvest_score_calculator_engine_1 = require("./engines/harvest-score-calculator.engine");
const harvest_confidence_calculator_engine_1 = require("./engines/harvest-confidence-calculator.engine");
const harvest_delay_detector_engine_1 = require("./engines/harvest-delay-detector.engine");
const harvest_window_engine_1 = require("./engines/harvest-window.engine");
const harvest_quality_assessor_engine_1 = require("./engines/harvest-quality-assessor.engine");
const harvest_labour_estimator_engine_1 = require("./engines/harvest-labour-estimator.engine");
const harvest_equipment_recommender_engine_1 = require("./engines/harvest-equipment-recommender.engine");
const harvest_storage_advisor_engine_1 = require("./engines/harvest-storage-advisor.engine");
const harvest_event_publisher_1 = require("./events/harvest-event.publisher");
const harvest_assess_job_1 = require("./jobs/harvest-assess.job");
const regional_harvest_service_1 = require("./regional/regional-harvest.service");
const harvest_mongo_module_1 = require("../mongodb/harvest/harvest-mongo.module");
const scheduler_module_1 = require("../scheduler/scheduler.module");
const event_bus_service_1 = require("../common/events/event-bus.service");
let HarvestIntelligenceModule = class HarvestIntelligenceModule {
};
exports.HarvestIntelligenceModule = HarvestIntelligenceModule;
exports.HarvestIntelligenceModule = HarvestIntelligenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            harvest_mongo_module_1.HarvestMongoModule,
            scheduler_module_1.SchedulerModule,
        ],
        controllers: [harvest_intelligence_controller_1.HarvestIntelligenceController],
        providers: [
            harvest_intelligence_service_1.HarvestIntelligenceService,
            crop_lifecycle_engine_1.CropLifecycleEngine,
            harvest_risk_analyzer_engine_1.HarvestRiskAnalyzerEngine,
            harvest_score_calculator_engine_1.HarvestScoreCalculatorEngine,
            harvest_confidence_calculator_engine_1.HarvestConfidenceCalculatorEngine,
            harvest_delay_detector_engine_1.HarvestDelayDetectorEngine,
            harvest_window_engine_1.HarvestWindowCalculatorEngine,
            harvest_quality_assessor_engine_1.HarvestQualityAssessorEngine,
            harvest_labour_estimator_engine_1.HarvestLabourEstimatorEngine,
            harvest_equipment_recommender_engine_1.HarvestEquipmentRecommenderEngine,
            harvest_storage_advisor_engine_1.HarvestStorageAdvisorEngine,
            harvest_assessment_engine_1.HarvestAssessmentEngine,
            harvest_estimator_engine_1.HarvestEstimatorEngine,
            event_bus_service_1.EventBusService,
            harvest_event_publisher_1.HarvestEventPublisher,
            harvest_assess_job_1.HarvestAssessJob,
            regional_harvest_service_1.RegionalHarvestService,
        ],
        exports: [
            harvest_intelligence_service_1.HarvestIntelligenceService,
            crop_lifecycle_engine_1.CropLifecycleEngine,
        ],
    })
], HarvestIntelligenceModule);
//# sourceMappingURL=harvest-intelligence.module.js.map