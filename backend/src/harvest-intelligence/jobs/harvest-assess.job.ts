import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerService } from '../../scheduler/scheduler.service';
import { SCHEDULER_CONSTANTS } from '../../scheduler/scheduler.constants';
import { HarvestIntelligenceService } from '../harvest-intelligence.service';

/**
 * HarvestAssessJob
 *
 * Registers the harvest_assess daily job with the existing SchedulerService.
 * The actual cron trigger will be wired in Phase 8.8 via @nestjs/schedule.
 *
 * Manual execution via: POST /harvest-intelligence/recalculate
 *
 * This class is Phase 8.8 ready — only job registration happens here.
 * When @nestjs/schedule is installed, add @Cron(SCHEDULER_CONSTANTS.CRON.DAILY_6AM)
 * to the runDailyAssessment() method.
 */
@Injectable()
export class HarvestAssessJob implements OnModuleInit {
  private readonly logger = new Logger(HarvestAssessJob.name);

  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly harvestIntelligenceService: HarvestIntelligenceService,
  ) {}

  /** Register the job definition on module startup */
  onModuleInit(): void {
    this.schedulerService.register({
      name: SCHEDULER_CONSTANTS.JOBS.HARVEST_ASSESS,
      description: 'Daily harvest readiness assessment for all active farmer crops',
      cronExpression: SCHEDULER_CONSTANTS.CRON.DAILY_6AM,
      priority: SCHEDULER_CONSTANTS.PRIORITY.HIGH,
      enabled: true,
      timeoutMs: SCHEDULER_CONSTANTS.TIMEOUTS.HARVEST_ASSESS,
      maxConcurrency: 1,
    });
    this.logger.log(`Job registered: ${SCHEDULER_CONSTANTS.JOBS.HARVEST_ASSESS} | cron=${SCHEDULER_CONSTANTS.CRON.DAILY_6AM}`);
  }

  /**
   * Daily harvest assessment job.
   *
   * Phase 8.8: Add @Cron(SCHEDULER_CONSTANTS.CRON.DAILY_6AM) decorator here.
   */
  async runDailyAssessment(): Promise<void> {
    const jobName = SCHEDULER_CONSTANTS.JOBS.HARVEST_ASSESS;
    this.schedulerService.markStarted(jobName);
    const startedAt = new Date();
    this.logger.log('Harvest assessment job started');

    try {
      const result = await this.harvestIntelligenceService.runBulkAssessment();
      this.schedulerService.markSuccess(jobName);
      this.logger.log(
        `Harvest assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`,
      );
    } catch (error: any) {
      this.schedulerService.markFailure(jobName);
      this.logger.error(`Harvest assessment job failed: ${error?.message}`);
    }
  }
}
