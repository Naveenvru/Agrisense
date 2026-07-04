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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestIntelligenceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const harvest_intelligence_service_1 = require("./harvest-intelligence.service");
const harvest_query_dto_1 = require("./dto/harvest-query.dto");
let HarvestIntelligenceController = class HarvestIntelligenceController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getSummary(req) {
        const assessments = await this.service.getMyAssessments(req.user.id);
        return {
            data: assessments,
            count: assessments.length,
        };
    }
    async getAssessment(id, req) {
        const data = await this.service.getAssessment(id, req.user.id);
        return { data };
    }
    async getReadiness(id, req) {
        const data = await this.service.getReadiness(id, req.user.id);
        return { data };
    }
    async getWindow(id, req) {
        const data = await this.service.getWindow(id, req.user.id);
        return { data };
    }
    async getRisk(id, req) {
        const data = await this.service.getRisk(id, req.user.id);
        return { data };
    }
    async getHistory(id, query, req) {
        const limit = query.limit ? parseInt(query.limit, 10) : 20;
        const data = await this.service.getHistory(id, req.user.id, limit);
        return { data, count: data.length };
    }
    async getEstimate(id, req) {
        const data = await this.service.getEstimate(id, req.user.id);
        return { data };
    }
    async getRegional(query) {
        const data = await this.service.getRegional(query.level, query.name);
        return { data };
    }
    async getAnalytics(query) {
        const limit = query.limit ? parseInt(query.limit, 10) : 12;
        const data = await this.service.getAnalytics(query.regionLevel ?? 'district', query.regionName, query.periodType, limit);
        return { data, count: data.length };
    }
    async recalculate(id, req) {
        const data = await this.service.assess(id, req.user.id);
        return {
            message: 'Harvest intelligence recalculated successfully',
            data,
        };
    }
    async recalculateAll() {
        const result = await this.service.runBulkAssessment();
        return {
            message: `Bulk assessment complete: ${result.assessed} assessed, ${result.failed} failed`,
            ...result,
        };
    }
};
exports.HarvestIntelligenceController = HarvestIntelligenceController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all active crop assessments for the authenticated user',
        description: 'Returns the latest harvest intelligence assessment for every active farmer crop ' +
            'belonging to the authenticated user. Triggers first-time assessment if not yet computed.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All assessments returned.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get complete harvest intelligence for a farmer crop',
        description: 'Returns full harvest intelligence: lifecycle stage, readiness, harvest window, ' +
            'risk, delay detection, yield estimate, quality, labour, equipment, and storage advice. ' +
            'Runs a fresh assessment on first access; subsequent calls return cached MongoDB data.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'ID of the farmer crop', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Full assessment returned.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Sowing date not set on this crop.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Farmer crop not found.' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getAssessment", null);
__decorate([
    (0, common_1.Get)('readiness/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get harvest readiness for a farmer crop',
        description: 'Returns readiness score (0-100), status, and explanation. Status: not-ready | developing | almost-ready | ready | harvested.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Readiness assessment returned.' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getReadiness", null);
__decorate([
    (0, common_1.Get)('window/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get harvest window for a farmer crop',
        description: 'Returns earliest, optimal, and latest safe harvest dates. ' +
            'Window is recalculated when weather or lifecycle changes.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Harvest window returned.' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getWindow", null);
__decorate([
    (0, common_1.Get)('risk/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get harvest risk analysis for a farmer crop',
        description: 'Returns risk level (low|medium|high|critical), risk factors, and mitigation recommendations.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Risk analysis returned.' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getRisk", null);
__decorate([
    (0, common_1.Get)('history/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get harvest prediction history for a farmer crop',
        description: 'Returns all historical assessment versions, newest first. Useful for AI training and audit.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Max entries to return', example: '10' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Prediction history returned.' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, harvest_query_dto_1.HistoryQueryDto, Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('estimate/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get harvest estimate for a farmer crop',
        description: 'Returns expected yield, quality grade, labour estimate, equipment recommendations, and storage advice. ' +
            'Does NOT include revenue or price — those belong to Phase 15.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Harvest estimate returned.' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getEstimate", null);
__decorate([
    (0, common_1.Get)('regional/summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get regional harvest summary',
        description: 'Aggregates harvest intelligence across village, taluk, district, or state. Reuses PostGIS location data.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: true, enum: ['village', 'taluk', 'district', 'state'], example: 'district' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: true, description: 'Region name', example: 'Bengaluru Urban' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Regional summary returned.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [harvest_query_dto_1.RegionalQueryDto]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getRegional", null);
__decorate([
    (0, common_1.Get)('analytics/trends'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get harvest analytics and trends',
        description: 'Returns stored monthly/weekly harvest analytics from MongoDB. Filter by region level, region name, and period type.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'regionLevel', required: false, example: 'district' }),
    (0, swagger_1.ApiQuery)({ name: 'regionName', required: false, example: 'Bengaluru' }),
    (0, swagger_1.ApiQuery)({ name: 'periodType', required: false, enum: ['weekly', 'monthly'], example: 'monthly' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: '12' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Analytics returned.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [harvest_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Post)('recalculate/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Force recalculate harvest intelligence for a farmer crop',
        description: 'Triggers a fresh assessment regardless of cache. Useful when sowing date, yield estimate, or weather changes significantly.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recalculated assessment returned.' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "recalculate", null);
__decorate([
    (0, common_1.Post)('recalculate-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Trigger bulk harvest assessment for all active crops',
        description: 'Runs the daily harvest assessment job on demand. Used by admin or scheduler during Phase 8.8 activation.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bulk assessment completed.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HarvestIntelligenceController.prototype, "recalculateAll", null);
exports.HarvestIntelligenceController = HarvestIntelligenceController = __decorate([
    (0, swagger_1.ApiTags)('Harvest Intelligence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('harvest-intelligence'),
    __metadata("design:paramtypes", [harvest_intelligence_service_1.HarvestIntelligenceService])
], HarvestIntelligenceController);
//# sourceMappingURL=harvest-intelligence.controller.js.map