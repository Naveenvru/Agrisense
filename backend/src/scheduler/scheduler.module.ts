import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';

/**
 * SchedulerModule
 *
 * Registers the SchedulerService for dependency injection.
 *
 * Phase 8.7: Job registration framework — NO cron execution.
 * Phase 8.8: Add ScheduleModule.forRoot() and @Cron-decorated job classes.
 *
 * Future jobs to add to providers[]:
 *   WeatherCollectorJob
 *   MarketCollectorJob
 *   DataCleanupJob
 *   ArchiveRawJob
 */
@Module({
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
