import { OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { DemandIntelligenceService } from '../demand-intelligence.service';
export declare class DemandAssessJob implements OnModuleInit {
    private readonly schedulerService;
    private readonly demandIntelligenceService;
    private readonly logger;
    constructor(schedulerService: SchedulerService, demandIntelligenceService: DemandIntelligenceService);
    onModuleInit(): void;
    runDailyAssessment(): Promise<void>;
}
