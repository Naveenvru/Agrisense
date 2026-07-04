import { Module } from '@nestjs/common';
import { YieldIntelligenceController } from './yield-intelligence.controller';
import { YieldIntelligenceService } from './yield-intelligence.service';
import { YieldMongoModule } from '../mongodb/yield/yield-mongo.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { WeatherModule } from '../weather/weather.module';
import { CalendarModule } from '../calendar/calendar.module';
import { GeoBoundaryModule } from '../geoboundary/geoboundary.module';
import { HarvestIntelligenceModule } from '../harvest-intelligence/harvest-intelligence.module';
import { EventBusService } from '../common/events/event-bus.service';
import { YieldEventPublisher } from './events/yield-event.publisher';
import { YieldAssessJob } from './jobs/yield-assess.job';
import { YieldAnalyticsService } from './services/yield-analytics.service';
import { RegionalYieldService } from './regional/regional-yield.service';
import { YIELD_ESTIMATOR } from './interfaces/yield-estimator.interface';
import { RuleBasedYieldEstimatorEngine } from './engines/rule-based-yield-estimator.engine';
import { YieldRiskAnalyzerEngine } from './engines/yield-risk-analyzer.engine';
import { YieldConfidenceCalculatorEngine } from './engines/yield-confidence-calculator.engine';
import { YieldQualityAssessorEngine } from './engines/yield-quality-assessor.engine';
import { YieldLossEstimatorEngine } from './engines/yield-loss-estimator.engine';
import { YieldRecommendationEngineImpl } from './engines/yield-recommendation.engine';

@Module({
  imports: [
    YieldMongoModule,
    SchedulerModule,
    WeatherModule,
    CalendarModule,
    GeoBoundaryModule,
    HarvestIntelligenceModule,
  ],
  controllers: [YieldIntelligenceController],
  providers: [
    YieldIntelligenceService,
    YieldEventPublisher,
    YieldAssessJob,
    YieldAnalyticsService,
    RegionalYieldService,
    EventBusService,
    YieldRiskAnalyzerEngine,
    YieldConfidenceCalculatorEngine,
    YieldQualityAssessorEngine,
    YieldLossEstimatorEngine,
    YieldRecommendationEngineImpl,
    {
      provide: YIELD_ESTIMATOR,
      useClass: RuleBasedYieldEstimatorEngine,
    },
  ],
  exports: [YieldIntelligenceService, YieldAnalyticsService, YIELD_ESTIMATOR],
})
export class YieldIntelligenceModule {}
