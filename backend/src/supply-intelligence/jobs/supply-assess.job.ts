import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { SCHEDULER_CONSTANTS } from '../../scheduler/scheduler.constants';
import { SupplyIntelligenceService } from '../supply-intelligence.service';

@Injectable()
export class SupplyAssessJob implements OnModuleInit {
  private readonly logger = new Logger(SupplyAssessJob.name);

  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly supplyIntelligenceService: SupplyIntelligenceService,
  ) {}

  onModuleInit(): void {
    this.schedulerService.register({
      name: SCHEDULER_CONSTANTS.JOBS.SUPPLY_ASSESS,
      description: 'Daily supply intelligence recalculation for all active farmer crops',
      cronExpression: SCHEDULER_CONSTANTS.CRON.DAILY_6AM,
      priority: SCHEDULER_CONSTANTS.PRIORITY.HIGH,
      enabled: true,
      timeoutMs: SCHEDULER_CONSTANTS.TIMEOUTS.SUPPLY_ASSESS,
      maxConcurrency: 1,
    });

    this.logger.log(`Job registered: ${SCHEDULER_CONSTANTS.JOBS.SUPPLY_ASSESS} | cron=${SCHEDULER_CONSTANTS.CRON.DAILY_6AM}`);
  }

  async runDailyAssessment(): Promise<void> {
    const jobName = SCHEDULER_CONSTANTS.JOBS.SUPPLY_ASSESS;
    this.schedulerService.markStarted(jobName);
    const startedAt = new Date();

    try {
      const result = await this.supplyIntelligenceService.runBulkAssessment();
      await this.supplyIntelligenceService.refreshAnalytics();
      this.schedulerService.markSuccess(jobName);
      this.logger.log(
        `Supply assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`,
      );
    } catch (error: any) {
      this.schedulerService.markFailure(jobName);
      this.logger.error(`Supply assessment job failed: ${error?.message}`);
    }
  }
}