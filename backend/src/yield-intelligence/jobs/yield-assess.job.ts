import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { SCHEDULER_CONSTANTS } from '../../scheduler/scheduler.constants';
import { YieldIntelligenceService } from '../yield-intelligence.service';

@Injectable()
export class YieldAssessJob implements OnModuleInit {
  private readonly logger = new Logger(YieldAssessJob.name);

  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly yieldIntelligenceService: YieldIntelligenceService,
  ) {}

  onModuleInit(): void {
    this.schedulerService.register({
      name: SCHEDULER_CONSTANTS.JOBS.YIELD_ASSESS,
      description: 'Daily yield intelligence recalculation for all active farmer crops',
      cronExpression: SCHEDULER_CONSTANTS.CRON.DAILY_6AM,
      priority: SCHEDULER_CONSTANTS.PRIORITY.HIGH,
      enabled: true,
      timeoutMs: SCHEDULER_CONSTANTS.TIMEOUTS.YIELD_ASSESS,
      maxConcurrency: 1,
    });

    this.logger.log(`Job registered: ${SCHEDULER_CONSTANTS.JOBS.YIELD_ASSESS} | cron=${SCHEDULER_CONSTANTS.CRON.DAILY_6AM}`);
  }

  async runDailyAssessment(): Promise<void> {
    const jobName = SCHEDULER_CONSTANTS.JOBS.YIELD_ASSESS;
    this.schedulerService.markStarted(jobName);
    const startedAt = new Date();

    try {
      const result = await this.yieldIntelligenceService.runBulkAssessment();
      await this.yieldIntelligenceService.refreshAnalytics();
      this.schedulerService.markSuccess(jobName);
      this.logger.log(
        `Yield assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`,
      );
    } catch (error: any) {
      this.schedulerService.markFailure(jobName);
      this.logger.error(`Yield assessment job failed: ${error?.message}`);
    }
  }
}
