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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DemandIntelligenceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemandIntelligenceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const demand_intelligence_service_1 = require("./demand-intelligence.service");
const demand_query_dto_1 = require("./dto/demand-query.dto");
let DemandIntelligenceController = DemandIntelligenceController_1 = class DemandIntelligenceController {
    demandService;
    logger = new common_1.Logger(DemandIntelligenceController_1.name);
    constructor(demandService) {
        this.demandService = demandService;
    }
    async getSummary(req) {
        this.logger.log(`GET /demand-intelligence/summary | userId=${req.user?.id}`);
        return this.demandService.getSummary(req.user.id);
    }
    async getRisk(req, farmerCropId) {
        this.logger.log(`GET /demand-intelligence/risk | userId=${req.user?.id} farmerCropId=${farmerCropId}`);
        return this.demandService.getRisk(farmerCropId, req.user.id);
    }
    async getTimeline(req, farmerCropId) {
        this.logger.log(`GET /demand-intelligence/timeline | userId=${req.user?.id} farmerCropId=${farmerCropId}`);
        return this.demandService.getTimeline(farmerCropId, req.user.id);
    }
    async getRegional(query) {
        this.logger.log(`GET /demand-intelligence/regional | level=${query.level} name=${query.name}`);
        return this.demandService.getRegional(query.level ?? 'district', query.name ?? '');
    }
    async getAnalytics(query) {
        this.logger.log(`GET /demand-intelligence/analytics | ${JSON.stringify(query)}`);
        return this.demandService.getAnalytics(query.regionLevel, query.regionName, query.periodType, query.limit ? Number(query.limit) : undefined);
    }
    async getAssessment(req, cropId) {
        this.logger.log(`GET /demand-intelligence/${cropId} | userId=${req.user?.id}`);
        return this.demandService.getAssessment(cropId, req.user.id);
    }
    async recalculate(req, query) {
        this.logger.log(`POST /demand-intelligence/recalculate | userId=${req.user?.id} farmerCropId=${query.farmerCropId}`);
        if (query.farmerCropId) {
            return this.demandService.assess(query.farmerCropId, req.user.id);
        }
        return this.demandService.runBulkAssessment(req.user.id);
    }
    async recalculateAll() {
        this.logger.log('POST /demand-intelligence/recalculate-all | admin bulk assessment');
        const result = await this.demandService.runBulkAssessment();
        await this.demandService.refreshAnalytics();
        return { ...result, message: 'Bulk demand assessment and analytics refresh completed.' };
    }
};
exports.DemandIntelligenceController = DemandIntelligenceController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'All active demand assessments for the authenticated user',
        description: 'Returns the latest demand prediction for every active farmer crop belonging to the authenticated user. ' +
            'If no assessments exist, triggers a fresh bulk assessment automatically.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Demand assessments returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('risk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Demand risk summary (single crop or portfolio)',
        description: 'Returns the demand risk assessment for a single crop (if farmerCropId is provided) or the highest-risk crop in the portfolio.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'farmerCropId', required: false, example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk summary returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('farmerCropId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "getRisk", null);
__decorate([
    (0, common_1.Get)('timeline'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Demand timeline (single crop or portfolio)',
        description: 'Returns the 6-point demand timeline for a specific crop or all active crops in the portfolio.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'farmerCropId', required: false, example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Demand timeline returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('farmerCropId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Get)('regional'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Regional demand summary by level and name',
        description: 'Returns aggregated demand across all active farmer crops for the specified region. ' +
            'level must be one of: village | taluk | district | state.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: true, example: 'district', enum: ['village', 'taluk', 'district', 'state'] }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: true, example: 'Bengaluru Urban' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Regional demand summary returned.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid region level.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [demand_query_dto_1.RegionalDemandQueryDto]),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "getRegional", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Demand analytics with optional filtering',
        description: 'Returns demand analytics snapshots. Can be filtered by regionLevel, regionName, and periodType. ' +
            'If no analytics exist, a fresh global snapshot is generated.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'regionLevel', required: false, example: 'district' }),
    (0, swagger_1.ApiQuery)({ name: 'regionName', required: false, example: 'Bengaluru Urban' }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', required: false, example: 'monthly' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: '12' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics data returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [demand_query_dto_1.DemandAnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)(':cropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Single crop full demand assessment',
        description: 'Returns the complete demand assessment for the specified farmer crop ID. ' +
            'If no assessment exists, triggers a fresh assessment automatically.',
    }),
    (0, swagger_1.ApiParam)({ name: 'cropId', description: 'Farmer crop ID', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Demand assessment returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Farmer crop not found or access denied.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('cropId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "getAssessment", null);
__decorate([
    (0, common_1.Post)('recalculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Recalculate demand for one crop or full portfolio',
        description: 'Triggers a fresh demand assessment. If farmerCropId is provided, recalculates only that crop. ' +
            'Otherwise recalculates all active crops for the authenticated user.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'farmerCropId', required: false, example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assessment(s) recalculated.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, demand_query_dto_1.DemandActionQueryDto]),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "recalculate", null);
__decorate([
    (0, common_1.Post)('recalculate-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk demand reassessment for ALL active crops (admin / scheduler)',
        description: 'Recalculates demand intelligence for every active farmer crop in the system. ' +
            'Also refreshes global and regional demand analytics. Used by the daily scheduler job.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk assessment completed.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DemandIntelligenceController.prototype, "recalculateAll", null);
exports.DemandIntelligenceController = DemandIntelligenceController = DemandIntelligenceController_1 = __decorate([
    (0, swagger_1.ApiTags)('Demand Intelligence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('demand-intelligence'),
    __metadata("design:paramtypes", [demand_intelligence_service_1.DemandIntelligenceService])
], DemandIntelligenceController);
//# sourceMappingURL=demand-intelligence.controller.js.map