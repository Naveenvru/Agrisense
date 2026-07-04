import { OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { YieldIntelligenceService } from '../yield-intelligence.service';
export declare class YieldAssessJob implements OnModuleInit {
    private readonly schedulerService;
    private readonly yieldIntelligenceService;
    private readonly logger;
    constructor(schedulerService: SchedulerService, yieldIntelligenceService: YieldIntelligenceService);
    onModuleInit(): void;
    runDailyAssessment(): Promise<void>;
}
