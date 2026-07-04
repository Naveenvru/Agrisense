"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldIntelligenceModule = void 0;
const common_1 = require("@nestjs/common");
const yield_intelligence_controller_1 = require("./yield-intelligence.controller");
const yield_intelligence_service_1 = require("./yield-intelligence.service");
const yield_mongo_module_1 = require("../mongodb/yield/yield-mongo.module");
const scheduler_module_1 = require("../scheduler/scheduler.module");
const weather_module_1 = require("../weather/weather.module");
const calendar_module_1 = require("../calendar/calendar.module");
const geoboundary_module_1 = require("../geoboundary/geoboundary.module");
const harvest_intelligence_module_1 = require("../harvest-intelligence/harvest-intelligence.module");
const event_bus_service_1 = require("../common/events/event-bus.service");
const yield_event_publisher_1 = require("./events/yield-event.publisher");
const yield_assess_job_1 = require("./jobs/yield-assess.job");
const yield_analytics_service_1 = require("./services/yield-analytics.service");
const regional_yield_service_1 = require("./regional/regional-yield.service");
const yield_estimator_interface_1 = require("./interfaces/yield-estimator.interface");
const rule_based_yield_estimator_engine_1 = require("./engines/rule-based-yield-estimator.engine");
const yield_risk_analyzer_engine_1 = require("./engines/yield-risk-analyzer.engine");
const yield_confidence_calculator_engine_1 = require("./engines/yield-confidence-calculator.engine");
const yield_quality_assessor_engine_1 = require("./engines/yield-quality-assessor.engine");
const yield_loss_estimator_engine_1 = require("./engines/yield-loss-estimator.engine");
const yield_recommendation_engine_1 = require("./engines/yield-recommendation.engine");
let YieldIntelligenceModule = class YieldIntelligenceModule {
};
exports.YieldIntelligenceModule = YieldIntelligenceModule;
exports.YieldIntelligenceModule = YieldIntelligenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            yield_mongo_module_1.YieldMongoModule,
            scheduler_module_1.SchedulerModule,
            weather_module_1.WeatherModule,
            calendar_module_1.CalendarModule,
            geoboundary_module_1.GeoBoundaryModule,
            harvest_intelligence_module_1.HarvestIntelligenceModule,
        ],
        controllers: [yield_intelligence_controller_1.YieldIntelligenceController],
        providers: [
            yield_intelligence_service_1.YieldIntelligenceService,
            yield_event_publisher_1.YieldEventPublisher,
            yield_assess_job_1.YieldAssessJob,
            yield_analytics_service_1.YieldAnalyticsService,
            regional_yield_service_1.RegionalYieldService,
            event_bus_service_1.EventBusService,
            yield_risk_analyzer_engine_1.YieldRiskAnalyzerEngine,
            yield_confidence_calculator_engine_1.YieldConfidenceCalculatorEngine,
            yield_quality_assessor_engine_1.YieldQualityAssessorEngine,
            yield_loss_estimator_engine_1.YieldLossEstimatorEngine,
            yield_recommendation_engine_1.YieldRecommendationEngineImpl,
            {
                provide: yield_estimator_interface_1.YIELD_ESTIMATOR,
                useClass: rule_based_yield_estimator_engine_1.RuleBasedYieldEstimatorEngine,
            },
        ],
        exports: [yield_intelligence_service_1.YieldIntelligenceService, yield_analytics_service_1.YieldAnalyticsService, yield_estimator_interface_1.YIELD_ESTIMATOR],
    })
], YieldIntelligenceModule);
//# sourceMappingURL=yield-intelligence.module.js.map