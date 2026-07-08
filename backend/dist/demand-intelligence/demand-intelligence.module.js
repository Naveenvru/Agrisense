"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandIntelligenceModule = void 0;
const common_1 = require("@nestjs/common");
const demand_intelligence_controller_1 = require("./demand-intelligence.controller");
const demand_intelligence_service_1 = require("./demand-intelligence.service");
const demand_mongo_module_1 = require("../mongodb/demand/demand-mongo.module");
const harvest_mongo_module_1 = require("../mongodb/harvest/harvest-mongo.module");
const yield_mongo_module_1 = require("../mongodb/yield/yield-mongo.module");
const supply_mongo_module_1 = require("../mongodb/supply/supply-mongo.module");
const scheduler_module_1 = require("../scheduler/scheduler.module");
const weather_module_1 = require("../weather/weather.module");
const geoboundary_module_1 = require("../geoboundary/geoboundary.module");
const market_module_1 = require("../market/market.module");
const event_bus_service_1 = require("../common/events/event-bus.service");
const demand_event_publisher_1 = require("./events/demand-event.publisher");
const demand_assess_job_1 = require("./jobs/demand-assess.job");
const demand_analytics_service_1 = require("./services/demand-analytics.service");
const regional_demand_service_1 = require("./regional/regional-demand.service");
const demand_estimator_interface_1 = require("./interfaces/demand-estimator.interface");
const demand_aggregator_interface_1 = require("./interfaces/demand-aggregator.interface");
const rule_based_demand_estimator_engine_1 = require("./engines/rule-based-demand-estimator.engine");
const demand_risk_analyzer_engine_1 = require("./engines/demand-risk-analyzer.engine");
const demand_confidence_calculator_engine_1 = require("./engines/demand-confidence-calculator.engine");
const demand_recommendation_engine_1 = require("./engines/demand-recommendation.engine");
let DemandIntelligenceModule = class DemandIntelligenceModule {
};
exports.DemandIntelligenceModule = DemandIntelligenceModule;
exports.DemandIntelligenceModule = DemandIntelligenceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            demand_mongo_module_1.DemandMongoModule,
            harvest_mongo_module_1.HarvestMongoModule,
            yield_mongo_module_1.YieldMongoModule,
            supply_mongo_module_1.SupplyMongoModule,
            scheduler_module_1.SchedulerModule,
            weather_module_1.WeatherModule,
            geoboundary_module_1.GeoBoundaryModule,
            market_module_1.MarketModule,
        ],
        controllers: [demand_intelligence_controller_1.DemandIntelligenceController],
        providers: [
            demand_intelligence_service_1.DemandIntelligenceService,
            demand_event_publisher_1.DemandEventPublisher,
            demand_analytics_service_1.DemandAnalyticsService,
            event_bus_service_1.EventBusService,
            demand_risk_analyzer_engine_1.DemandRiskAnalyzerEngine,
            demand_confidence_calculator_engine_1.DemandConfidenceCalculatorEngine,
            demand_recommendation_engine_1.DemandRecommendationEngine,
            demand_assess_job_1.DemandAssessJob,
            {
                provide: demand_estimator_interface_1.DEMAND_ESTIMATOR,
                useClass: rule_based_demand_estimator_engine_1.RuleBasedDemandEstimatorEngine,
            },
            {
                provide: demand_aggregator_interface_1.DEMAND_AGGREGATOR,
                useClass: regional_demand_service_1.RegionalDemandService,
            },
        ],
        exports: [demand_intelligence_service_1.DemandIntelligenceService, demand_analytics_service_1.DemandAnalyticsService, demand_estimator_interface_1.DEMAND_ESTIMATOR],
    })
], DemandIntelligenceModule);
//# sourceMappingURL=demand-intelligence.module.js.map