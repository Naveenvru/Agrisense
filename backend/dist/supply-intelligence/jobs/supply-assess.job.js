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
var SupplyAssessJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplyAssessJob = void 0;
const common_1 = require("@nestjs/common");
const scheduler_service_1 = require("../../scheduler/scheduler.service");
const scheduler_constants_1 = require("../../scheduler/scheduler.constants");
const supply_intelligence_service_1 = require("../supply-intelligence.service");
let SupplyAssessJob = SupplyAssessJob_1 = class SupplyAssessJob {
    schedulerService;
    supplyIntelligenceService;
    logger = new common_1.Logger(SupplyAssessJob_1.name);
    constructor(schedulerService, supplyIntelligenceService) {
        this.schedulerService = schedulerService;
        this.supplyIntelligenceService = supplyIntelligenceService;
    }
    onModuleInit() {
        this.schedulerService.register({
            name: scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.SUPPLY_ASSESS,
            description: 'Daily supply intelligence recalculation for all active farmer crops',
            cronExpression: scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_6AM,
            priority: scheduler_constants_1.SCHEDULER_CONSTANTS.PRIORITY.HIGH,
            enabled: true,
            timeoutMs: scheduler_constants_1.SCHEDULER_CONSTANTS.TIMEOUTS.SUPPLY_ASSESS,
            maxConcurrency: 1,
        });
        this.logger.log(`Job registered: ${scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.SUPPLY_ASSESS} | cron=${scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_6AM}`);
    }
    async runDailyAssessment() {
        const jobName = scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.SUPPLY_ASSESS;
        this.schedulerService.markStarted(jobName);
        const startedAt = new Date();
        try {
            const result = await this.supplyIntelligenceService.runBulkAssessment();
            await this.supplyIntelligenceService.refreshAnalytics();
            this.schedulerService.markSuccess(jobName);
            this.logger.log(`Supply assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`);
        }
        catch (error) {
            this.schedulerService.markFailure(jobName);
            this.logger.error(`Supply assessment job failed: ${error?.message}`);
        }
    }
};
exports.SupplyAssessJob = SupplyAssessJob;
exports.SupplyAssessJob = SupplyAssessJob = SupplyAssessJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scheduler_service_1.SchedulerService,
        supply_intelligence_service_1.SupplyIntelligenceService])
], SupplyAssessJob);
//# sourceMappingURL=supply-assess.job.js.map