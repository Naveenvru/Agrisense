import { SchedulerJobName } from './scheduler.constants';

/**
 * Scheduler Types
 *
 * TypeScript type definitions for the scheduler framework.
 */

/** Definition of a scheduled job */
export interface ScheduledJob {
  /** Unique job name */
  name: SchedulerJobName | string;
  /** Human-readable description */
  description: string;
  /** Cron expression */
  cronExpression: string;
  /** Priority (lower = higher priority) */
  priority: number;
  /** Whether the job is currently enabled */
  enabled: boolean;
  /** Timeout in milliseconds before the job is considered failed */
  timeoutMs: number;
  /** Maximum concurrent instances of this job (default: 1) */
  maxConcurrency: number;
}

/** Result returned when a scheduled job completes */
export interface JobResult {
  job: string;
  success: boolean;
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
  errorMessage?: string;
  /** Number of records processed */
  recordsProcessed?: number;
}

/** Status snapshot for a registered job */
export interface JobStatus {
  name: string;
  enabled: boolean;
  lastRunAt?: Date;
  lastSuccessAt?: Date;
  lastFailureAt?: Date;
  totalRuns: number;
  successCount: number;
  failureCount: number;
  nextRunAt?: Date;
}
