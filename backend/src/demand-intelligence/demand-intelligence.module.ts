import { Module } from '@nestjs/common';
import { DemandIntelligenceController } from './demand-intelligence.controller';
import { DemandIntelligenceService } from './demand-intelligence.service';
import { DemandMongoModule } from '../mongodb/demand/demand-mongo.module';
import { HarvestMongoModule } from '../mongodb/harvest/harvest-mongo.module';
import { YieldMongoModule } from '../mongodb/yield/yield-mongo.module';
import { SupplyMongoModule } from '../mongodb/supply/supply-mongo.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { WeatherModule } from '../weather/weather.module';
import { GeoBoundaryModule } from '../geoboundary/geoboundary.module';
import { MarketModule } from '../market/market.module';
import { EventBusService } from '../common/events/event-bus.service';
import { DemandEventPublisher } from './events/demand-event.publisher';
import { DemandAssessJob } from './jobs/demand-assess.job';
import { DemandAnalyticsService } from './services/demand-analytics.service';
import { RegionalDemandService } from './regional/regional-demand.service';
import { DEMAND_ESTIMATOR } from './interfaces/demand-estimator.interface';
import { DEMAND_AGGREGATOR } from './interfaces/demand-aggregator.interface';
import { RuleBasedDemandEstimatorEngine } from './engines/rule-based-demand-estimator.engine';
import { DemandRiskAnalyzerEngine } from './engines/demand-risk-analyzer.engine';
import { DemandConfidenceCalculatorEngine } from './engines/demand-confidence-calculator.engine';
import { DemandRecommendationEngine } from './engines/demand-recommendation.engine';

@Module({
  imports: [
    DemandMongoModule,
    HarvestMongoModule,
    YieldMongoModule,
    SupplyMongoModule,
    SchedulerModule,
    WeatherModule,
    GeoBoundaryModule,
    MarketModule,
  ],
  controllers: [DemandIntelligenceController],
  providers: [
    DemandIntelligenceService,
    DemandEventPublisher,
    DemandAnalyticsService,
    EventBusService,
    DemandRiskAnalyzerEngine,
    DemandConfidenceCalculatorEngine,
    DemandRecommendationEngine,
    DemandAssessJob,
    {
      provide: DEMAND_ESTIMATOR,
      useClass: RuleBasedDemandEstimatorEngine,
    },
    {
      provide: DEMAND_AGGREGATOR,
      useClass: RegionalDemandService,
    },
  ],
  exports: [DemandIntelligenceService, DemandAnalyticsService, DEMAND_ESTIMATOR],
})
export class DemandIntelligenceModule {}
