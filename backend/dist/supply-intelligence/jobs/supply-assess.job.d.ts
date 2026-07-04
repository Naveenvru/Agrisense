import { OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { SupplyIntelligenceService } from '../supply-intelligence.service';
export declare class SupplyAssessJob implements OnModuleInit {
    private readonly schedulerService;
    private readonly supplyIntelligenceService;
    private readonly logger;
    constructor(schedulerService: SchedulerService, supplyIntelligenceService: SupplyIntelligenceService);
    onModuleInit(): void;
    runDailyAssessment(): Promise<void>;
}
