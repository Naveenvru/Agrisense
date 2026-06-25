import { Injectable, Logger } from '@nestjs/common';
import { ScheduledJob, JobStatus } from './scheduler.types';

/**
 * SchedulerService
 *
 * The job registry and execution coordinator for the AgriSense scheduler.
 *
 * Phase 8.7: Job registration and status tracking only.
 *            NO actual Cron execution — that requires @nestjs/schedule.
 *
 * Phase 8.8 (Scheduler Activation):
 *   1. Install @nestjs/schedule
 *   2. Add ScheduleModule.forRoot() to AppModule
 *   3. Decorate job methods with @Cron(SCHEDULER_CONSTANTS.CRON.EVERY_30_MINUTES)
 *   4. No other changes needed
 *
 * Future jobs
 * ────────────
 * weather_collect      — every 30 min
 * market_collect       — every 6 hours
 * government_collect   — daily
 * data_cleanup         — weekly
 * archive_raw          — daily
 * generate_reports     — daily
 */
@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  private readonly jobs = new Map<string, ScheduledJob>();
  private readonly jobStats = new Map<string, JobStatus>();

  /**
   * Register a job definition.
   * Phase 8.8 will pick these up and wire them to @Cron decorators.
   */
  register(job: ScheduledJob): void {
    this.jobs.set(job.name, job);
    this.jobStats.set(job.name, {
      name: job.name,
      enabled: job.enabled,
      totalRuns: 0,
      successCount: 0,
      failureCount: 0,
    });

    this.logger.log(
      `Job registered: "${job.name}" | cron=${job.cronExpression} | enabled=${job.enabled}`,
    );
  }

  /**
   * Return status snapshots for all registered jobs.
   */
  getAllStatus(): JobStatus[] {
    return Array.from(this.jobStats.values());
  }

  /**
   * Return status for a specific job.
   */
  getStatus(jobName: string): JobStatus | undefined {
    return this.jobStats.get(jobName);
  }

  /**
   * Mark a job as having just started.
   */
  markStarted(jobName: string): void {
    const stat = this.jobStats.get(jobName);
    if (stat) {
      stat.lastRunAt = new Date();
      stat.totalRuns++;
    }
  }

  /**
   * Mark a job as having succeeded.
   */
  markSuccess(jobName: string): void {
    const stat = this.jobStats.get(jobName);
    if (stat) {
      stat.lastSuccessAt = new Date();
      stat.successCount++;
    }
  }

  /**
   * Mark a job as having failed.
   */
  markFailure(jobName: string): void {
    const stat = this.jobStats.get(jobName);
    if (stat) {
      stat.lastFailureAt = new Date();
      stat.failureCount++;
    }
  }

  /**
   * Enable or disable a registered job.
   */
  setEnabled(jobName: string, enabled: boolean): void {
    const job = this.jobs.get(jobName);
    const stat = this.jobStats.get(jobName);

    if (job) job.enabled = enabled;
    if (stat) stat.enabled = enabled;

    this.logger.log(`Job "${jobName}" ${enabled ? 'enabled' : 'disabled'}`);
  }
}
