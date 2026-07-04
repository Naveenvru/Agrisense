import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HarvestIntelligenceController } from './harvest-intelligence.controller';
import { HarvestIntelligenceService } from './harvest-intelligence.service';
import { CropLifecycleEngine } from './engines/crop-lifecycle.engine';
import { HarvestAssessmentEngine } from './engines/harvest-assessment.engine';
import { HarvestEstimatorEngine } from './engines/harvest-estimator.engine';
import { HarvestRiskAnalyzerEngine } from './engines/harvest-risk-analyzer.engine';
import { HarvestScoreCalculatorEngine } from './engines/harvest-score-calculator.engine';
import { HarvestConfidenceCalculatorEngine } from './engines/harvest-confidence-calculator.engine';
import { HarvestDelayDetectorEngine } from './engines/harvest-delay-detector.engine';
import { HarvestWindowCalculatorEngine } from './engines/harvest-window.engine';
import { HarvestQualityAssessorEngine } from './engines/harvest-quality-assessor.engine';
import { HarvestLabourEstimatorEngine } from './engines/harvest-labour-estimator.engine';
import { HarvestEquipmentRecommenderEngine } from './engines/harvest-equipment-recommender.engine';
import { HarvestStorageAdvisorEngine } from './engines/harvest-storage-advisor.engine';
import { HarvestEventPublisher } from './events/harvest-event.publisher';
import { HarvestAssessJob } from './jobs/harvest-assess.job';
import { RegionalHarvestService } from './regional/regional-harvest.service';
import { HarvestMongoModule } from '../mongodb/harvest/harvest-mongo.module';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { EventBusService } from '../common/events/event-bus.service';

@Module({
  imports: [
    HarvestMongoModule,
    SchedulerModule,
  ],
  controllers: [HarvestIntelligenceController],
  providers: [
    HarvestIntelligenceService,
    // Sub-engines
    CropLifecycleEngine,
    HarvestRiskAnalyzerEngine,
    HarvestScoreCalculatorEngine,
    HarvestConfidenceCalculatorEngine,
    HarvestDelayDetectorEngine,
    HarvestWindowCalculatorEngine,
    HarvestQualityAssessorEngine,
    HarvestLabourEstimatorEngine,
    HarvestEquipmentRecommenderEngine,
    HarvestStorageAdvisorEngine,
    // Main orchestrating engines
    HarvestAssessmentEngine,
    HarvestEstimatorEngine,
    // Events & Regional
    EventBusService,
    HarvestEventPublisher,
    HarvestAssessJob,
    RegionalHarvestService,
  ],
  exports: [
    HarvestIntelligenceService,
    CropLifecycleEngine,
    HarvestAssessmentEngine,
  ],
})
export class HarvestIntelligenceModule {}
