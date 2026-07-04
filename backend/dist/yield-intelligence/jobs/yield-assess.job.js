"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var YieldAssessJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldAssessJob = void 0;
const common_1 = require("@nestjs/common");
const scheduler_service_1 = require("../../scheduler/scheduler.service");
const scheduler_constants_1 = require("../../scheduler/scheduler.constants");
const yield_intelligence_service_1 = require("../yield-intelligence.service");
let YieldAssessJob = YieldAssessJob_1 = class YieldAssessJob {
    schedulerService;
    yieldIntelligenceService;
    logger = new common_1.Logger(YieldAssessJob_1.name);
    constructor(schedulerService, yieldIntelligenceService) {
        this.schedulerService = schedulerService;
        this.yieldIntelligenceService = yieldIntelligenceService;
    }
    onModuleInit() {
        this.schedulerService.register({
            name: scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.YIELD_ASSESS,
            description: 'Daily yield intelligence recalculation for all active farmer crops',
            cronExpression: scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_6AM,
            priority: scheduler_constants_1.SCHEDULER_CONSTANTS.PRIORITY.HIGH,
            enabled: true,
            timeoutMs: scheduler_constants_1.SCHEDULER_CONSTANTS.TIMEOUTS.YIELD_ASSESS,
            maxConcurrency: 1,
        });
        this.logger.log(`Job registered: ${scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.YIELD_ASSESS} | cron=${scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_6AM}`);
    }
    async runDailyAssessment() {
        const jobName = scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.YIELD_ASSESS;
        this.schedulerService.markStarted(jobName);
        const startedAt = new Date();
        try {
            const result = await this.yieldIntelligenceService.runBulkAssessment();
            await this.yieldIntelligenceService.refreshAnalytics();
            this.schedulerService.markSuccess(jobName);
            this.logger.log(`Yield assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`);
        }
        catch (error) {
            this.schedulerService.markFailure(jobName);
            this.logger.error(`Yield assessment job failed: ${error?.message}`);
        }
    }
};
exports.YieldAssessJob = YieldAssessJob;
exports.YieldAssessJob = YieldAssessJob = YieldAssessJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scheduler_service_1.SchedulerService,
        yield_intelligence_service_1.YieldIntelligenceService])
], YieldAssessJob);
//# sourceMappingURL=yield-assess.job.js.map