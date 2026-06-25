import { ScheduledJob, JobStatus } from './scheduler.types';
export declare class SchedulerService {
    private readonly logger;
    private readonly jobs;
    private readonly jobStats;
    register(job: ScheduledJob): void;
    getAllStatus(): JobStatus[];
    getStatus(jobName: string): JobStatus | undefined;
    markStarted(jobName: string): void;
    markSuccess(jobName: string): void;
    markFailure(jobName: string): void;
    setEnabled(jobName: string, enabled: boolean): void;
}
