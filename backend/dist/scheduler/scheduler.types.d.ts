import { SchedulerJobName } from './scheduler.constants';
export interface ScheduledJob {
    name: SchedulerJobName | string;
    description: string;
    cronExpression: string;
    priority: number;
    enabled: boolean;
    timeoutMs: number;
    maxConcurrency: number;
}
export interface JobResult {
    job: string;
    success: boolean;
    startedAt: Date;
    completedAt: Date;
    durationMs: number;
    errorMessage?: string;
    recordsProcessed?: number;
}
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
