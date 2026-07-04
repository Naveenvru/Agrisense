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
var HarvestAssessJob_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestAssessJob = void 0;
const common_1 = require("@nestjs/common");
const scheduler_service_1 = require("../../scheduler/scheduler.service");
const scheduler_constants_1 = require("../../scheduler/scheduler.constants");
const harvest_intelligence_service_1 = require("../harvest-intelligence.service");
let HarvestAssessJob = HarvestAssessJob_1 = class HarvestAssessJob {
    schedulerService;
    harvestIntelligenceService;
    logger = new common_1.Logger(HarvestAssessJob_1.name);
    constructor(schedulerService, harvestIntelligenceService) {
        this.schedulerService = schedulerService;
        this.harvestIntelligenceService = harvestIntelligenceService;
    }
    onModuleInit() {
        this.schedulerService.register({
            name: scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.HARVEST_ASSESS,
            description: 'Daily harvest readiness assessment for all active farmer crops',
            cronExpression: scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_6AM,
            priority: scheduler_constants_1.SCHEDULER_CONSTANTS.PRIORITY.HIGH,
            enabled: true,
            timeoutMs: scheduler_constants_1.SCHEDULER_CONSTANTS.TIMEOUTS.HARVEST_ASSESS,
            maxConcurrency: 1,
        });
        this.logger.log(`Job registered: ${scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.HARVEST_ASSESS} | cron=${scheduler_constants_1.SCHEDULER_CONSTANTS.CRON.DAILY_6AM}`);
    }
    async runDailyAssessment() {
        const jobName = scheduler_constants_1.SCHEDULER_CONSTANTS.JOBS.HARVEST_ASSESS;
        this.schedulerService.markStarted(jobName);
        const startedAt = new Date();
        this.logger.log('Harvest assessment job started');
        try {
            const result = await this.harvestIntelligenceService.runBulkAssessment();
            this.schedulerService.markSuccess(jobName);
            this.logger.log(`Harvest assessment job completed | assessed=${result.assessed} failed=${result.failed} durationMs=${Date.now() - startedAt.getTime()}`);
        }
        catch (error) {
            this.schedulerService.markFailure(jobName);
            this.logger.error(`Harvest assessment job failed: ${error?.message}`);
        }
    }
};
exports.HarvestAssessJob = HarvestAssessJob;
exports.HarvestAssessJob = HarvestAssessJob = HarvestAssessJob_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scheduler_service_1.SchedulerService,
        harvest_intelligence_service_1.HarvestIntelligenceService])
], HarvestAssessJob);
//# sourceMappingURL=harvest-assess.job.js.map