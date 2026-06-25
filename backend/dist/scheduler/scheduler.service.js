"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SchedulerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
const common_1 = require("@nestjs/common");
let SchedulerService = SchedulerService_1 = class SchedulerService {
    logger = new common_1.Logger(SchedulerService_1.name);
    jobs = new Map();
    jobStats = new Map();
    register(job) {
        this.jobs.set(job.name, job);
        this.jobStats.set(job.name, {
            name: job.name,
            enabled: job.enabled,
            totalRuns: 0,
            successCount: 0,
            failureCount: 0,
        });
        this.logger.log(`Job registered: "${job.name}" | cron=${job.cronExpression} | enabled=${job.enabled}`);
    }
    getAllStatus() {
        return Array.from(this.jobStats.values());
    }
    getStatus(jobName) {
        return this.jobStats.get(jobName);
    }
    markStarted(jobName) {
        const stat = this.jobStats.get(jobName);
        if (stat) {
            stat.lastRunAt = new Date();
            stat.totalRuns++;
        }
    }
    markSuccess(jobName) {
        const stat = this.jobStats.get(jobName);
        if (stat) {
            stat.lastSuccessAt = new Date();
            stat.successCount++;
        }
    }
    markFailure(jobName) {
        const stat = this.jobStats.get(jobName);
        if (stat) {
            stat.lastFailureAt = new Date();
            stat.failureCount++;
        }
    }
    setEnabled(jobName, enabled) {
        const job = this.jobs.get(jobName);
        const stat = this.jobStats.get(jobName);
        if (job)
            job.enabled = enabled;
        if (stat)
            stat.enabled = enabled;
        this.logger.log(`Job "${jobName}" ${enabled ? 'enabled' : 'disabled'}`);
    }
};
exports.SchedulerService = SchedulerService;
exports.SchedulerService = SchedulerService = SchedulerService_1 = __decorate([
    (0, common_1.Injectable)()
], SchedulerService);
//# sourceMappingURL=scheduler.service.js.map