import { Module } from '@nestjs/common';
import { SupplyIntelligenceController } from './supply-intelligence.controller';
import { SupplyIntelligenceService } from './supply-intelligence.service';
import { SupplyMongoModule } from '../mongodb/supply/supply-mongo.module';
import { HarvestMongoModule } from '../mongodb/harvest/harvest-mongo.module';
import { YieldMongoModule } from '../mongodb/yield/yield-mongo.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { WeatherModule } from '../weather/weather.module';
import { CalendarModule } from '../calendar/calendar.module';
import { GeoBoundaryModule } from '../geoboundary/geoboundary.module';
import { EventBusService } from '../common/events/event-bus.service';
import { SupplyEventPublisher } from './events/supply-event.publisher';
import { SupplyAssessJob } from './jobs/supply-assess.job';
import { SupplyAnalyticsService } from './services/supply-analytics.service';
import { RegionalSupplyService } from './regional/regional-supply.service';
import { SUPPLY_ESTIMATOR } from './interfaces/supply-estimator.interface';
import { SUPPLY_AGGREGATOR } from './interfaces/supply-aggregator.interface';
import { RuleBasedSupplyEstimatorEngine } from './engines/rule-based-supply-estimator.engine';
import { SupplyRiskAnalyzerEngine } from './engines/supply-risk-analyzer.engine';
import { SupplyConfidenceCalculatorEngine } from './engines/supply-confidence-calculator.engine';
import { SupplyRecommendationEngine } from './engines/supply-recommendation.engine';

@Module({
  imports: [
    SupplyMongoModule,
    HarvestMongoModule,
    YieldMongoModule,
    SchedulerModule,
    WeatherModule,
    CalendarModule,
    GeoBoundaryModule,
  ],
  controllers: [SupplyIntelligenceController],
  providers: [
    SupplyIntelligenceService,
    SupplyEventPublisher,
    SupplyAssessJob,
    SupplyAnalyticsService,
    EventBusService,
    SupplyRiskAnalyzerEngine,
    SupplyConfidenceCalculatorEngine,
    SupplyRecommendationEngine,
    {
      provide: SUPPLY_ESTIMATOR,
      useClass: RuleBasedSupplyEstimatorEngine,
    },
    {
      provide: SUPPLY_AGGREGATOR,
      useClass: RegionalSupplyService,
    },
  ],
  exports: [SupplyIntelligenceService, SupplyAnalyticsService, SUPPLY_ESTIMATOR],
})
export class SupplyIntelligenceModule {}