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
var DemandAssessJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandAssessJob = void 0;
const common_1 = require("@nestjs/common");
const scheduler_service_1 = require("../../scheduler/scheduler.service");
const scheduler_constants_1 = require("../../scheduler/scheduler.constants");
const demand_intelligence_service_1 = require("../demand-intelligence.service");
let DemandAssessJob = DemandAssessJob_1 = class DemandAssessJob {
    schedulerService;
    demandIntelligenceService;
    logger = new common_1.Logger(DemandAssessJob_1.name);
    constructor(schedulerService, demandIntelligenceService) {
        this.schedulerService = schedulerService;
        this.demandIntelligenceService = demandIntelligenceService;
    }
    onModuleInit() {
        this.schedulerService.register({
            name: scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.DEMAND_ASSESS,
            description: 'Daily demand intelligence recalculation for all active farmer crops',
            cronExpression: scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_7AM,
            priority: scheduler_constants_1.SCHEDULER_CONSTANTS.PRIORITY.HIGH,
            enabled: true,
            timeoutMs: scheduler_constants_1.SCHEDULER_CONSTANTS.TIMEOUTS.DEMAND_ASSESS,
            maxConcurrency: 1,
        });
        this.logger.log(`Job registered: ${scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.DEMAND_ASSESS} | cron=${scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_7AM}`);
    }
    async runDailyAssessment() {
        const jobName = scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.DEMAND_ASSESS;
        this.schedulerService.markStarted(jobName);
        const startedAt = new Date();
        try {
            const result = await this.demandIntelligenceService.runBulkAssessment();
            await this.demandIntelligenceService.refreshAnalytics();
            this.schedulerService.markSuccess(jobName);
            this.logger.log(`Demand assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`);
        }
        catch (error) {
            this.schedulerService.markFailure(jobName);
            this.logger.error(`Demand assessment job failed: ${error?.message}`);
        }
    }
};
exports.DemandAssessJob = DemandAssessJob;
exports.DemandAssessJob = DemandAssessJob = DemandAssessJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scheduler_service_1.SchedulerService,
        demand_intelligence_service_1.DemandIntelligenceService])
], DemandAssessJob);
//# sourceMappingURL=demand-assess.job.js.map