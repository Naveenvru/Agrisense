"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyIntelligenceModule = void 0;
const common_1 = require("@nestjs/common");
const supply_intelligence_controller_1 = require("./supply-intelligence.controller");
const supply_intelligence_service_1 = require("./supply-intelligence.service");
const supply_mongo_module_1 = require("../mongodb/supply/supply-mongo.module");
const harvest_mongo_module_1 = require("../mongodb/harvest/harvest-mongo.module");
const yield_mongo_module_1 = require("../mongodb/yield/yield-mongo.module");
const scheduler_module_1 = require("../scheduler/scheduler.module");
const weather_module_1 = require("../weather/weather.module");
const calendar_module_1 = require("../calendar/calendar.module");
const geoboundary_module_1 = require("../geoboundary/geoboundary.module");
const event_bus_service_1 = require("../common/events/event-bus.service");
const supply_event_publisher_1 = require("./events/supply-event.publisher");
const supply_assess_job_1 = require("./jobs/supply-assess.job");
const supply_analytics_service_1 = require("./services/supply-analytics.service");
const regional_supply_service_1 = require("./regional/regional-supply.service");
const supply_estimator_interface_1 = require("./interfaces/supply-estimator.interface");
const supply_aggregator_interface_1 = require("./interfaces/supply-aggregator.interface");
const rule_based_supply_estimator_engine_1 = require("./engines/rule-based-supply-estimator.engine");
const supply_risk_analyzer_engine_1 = require("./engines/supply-risk-analyzer.engine");
const supply_confidence_calculator_engine_1 = require("./engines/supply-confidence-calculator.engine");
const supply_recommendation_engine_1 = require("./engines/supply-recommendation.engine");
let SupplyIntelligenceModule = class SupplyIntelligenceModule {
};
exports.SupplyIntelligenceModule = SupplyIntelligenceModule;
exports.SupplyIntelligenceModule = SupplyIntelligenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            supply_mongo_module_1.SupplyMongoModule,
            harvest_mongo_module_1.HarvestMongoModule,
            yield_mongo_module_1.YieldMongoModule,
            scheduler_module_1.SchedulerModule,
            weather_module_1.WeatherModule,
            calendar_module_1.CalendarModule,
            geoboundary_module_1.GeoBoundaryModule,
        ],
        controllers: [supply_intelligence_controller_1.SupplyIntelligenceController],
        providers: [
            supply_intelligence_service_1.SupplyIntelligenceService,
            supply_event_publisher_1.SupplyEventPublisher,
            supply_assess_job_1.SupplyAssessJob,
            supply_analytics_service_1.SupplyAnalyticsService,
            event_bus_service_1.EventBusService,
            supply_risk_analyzer_engine_1.SupplyRiskAnalyzerEngine,
            supply_confidence_calculator_engine_1.SupplyConfidenceCalculatorEngine,
            supply_recommendation_engine_1.SupplyRecommendationEngine,
            {
                provide: supply_estimator_interface_1.SUPPLY_ESTIMATOR,
                useClass: rule_based_supply_estimator_engine_1.RuleBasedSupplyEstimatorEngine,
            },
            {
                provide: supply_aggregator_interface_1.SUPPLY_AGGREGATOR,
                useClass: regional_supply_service_1.RegionalSupplyService,
            },
        ],
        exports: [supply_intelligence_service_1.SupplyIntelligenceService, supply_analytics_service_1.SupplyAnalyticsService, supply_estimator_interface_1.SUPPLY_ESTIMATOR],
    })
], SupplyIntelligenceModule);
//# sourceMappingURL=supply-intelligence.module.js.map