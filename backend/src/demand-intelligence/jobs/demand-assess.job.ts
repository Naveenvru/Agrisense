import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { SCHEDULER_CONSTANTS } from '../../scheduler/scheduler.constants';
import { DemandIntelligenceService } from '../demand-intelligence.service';

@Injectable()
export class DemandAssessJob implements OnModuleInit {
  private readonly logger = new Logger(DemandAssessJob.name);

  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly demandIntelligenceService: DemandIntelligenceService,
  ) {}

  onModuleInit(): void {
    this.schedulerService.register({
      name: SCHEDULER_CONSTANTS.JOBS.DEMAND_ASSESS,
      description: 'Daily demand intelligence recalculation for all active farmer crops',
      cronExpression: SCHEDULER_CONSTANTS.CRON.DAILY_7AM,
      priority: SCHEDULER_CONSTANTS.PRIORITY.HIGH,
      enabled: true,
      timeoutMs: SCHEDULER_CONSTANTS.TIMEOUTS.DEMAND_ASSESS,
      maxConcurrency: 1,
    });

    this.logger.log(`Job registered: ${SCHEDULER_CONSTANTS.JOBS.DEMAND_ASSESS} | cron=${SCHEDULER_CONSTANTS.CRON.DAILY_7AM}`);
  }

  async runDailyAssessment(): Promise<void> {
    const jobName = SCHEDULER_CONSTANTS.JOBS.DEMAND_ASSESS;
    this.schedulerService.markStarted(jobName);
    const startedAt = new Date();

    try {
      const result = await this.demandIntelligenceService.runBulkAssessment();
      await this.demandIntelligenceService.refreshAnalytics();
      this.schedulerService.markSuccess(jobName);
      this.logger.log(
        `Demand assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`,
      );
    } catch (error: any) {
      this.schedulerService.markFailure(jobName);
      this.logger.error(`Demand assessment job failed: ${error?.message}`);
    }
  }
}
