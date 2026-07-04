import { OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { HarvestIntelligenceService } from '../harvest-intelligence.service';
export declare class HarvestAssessJob implements OnModuleInit {
    private readonly schedulerService;
    private readonly harvestIntelligenceService;
    private readonly logger;
    constructor(schedulerService: SchedulerService, harvestIntelligenceService: HarvestIntelligenceService);
    onModuleInit(): void;
    runDailyAssessment(): Promise<void>;
}
