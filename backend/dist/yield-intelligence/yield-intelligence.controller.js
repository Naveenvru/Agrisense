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
exports.YieldIntelligenceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const yield_intelligence_service_1 = require("./yield-intelligence.service");
const yield_query_dto_1 = require("./dto/yield-query.dto");
let YieldIntelligenceController = class YieldIntelligenceController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getSummary(req) {
        const assessments = await this.service.getSummary(req.user.id);
        return { data: assessments, count: assessments.length };
    }
    async getRisk(id, req) {
        const data = await this.service.getRisk(id, req.user.id);
        return { data };
    }
    async getConfidence(id, req) {
        const data = await this.service.getConfidence(id, req.user.id);
        return { data };
    }
    async getLoss(id, req) {
        const data = await this.service.getLoss(id, req.user.id);
        return { data };
    }
    async getRegional(query) {
        const data = await this.service.getRegional(query.level, query.name);
        return { data };
    }
    async getAnalytics(query) {
        const limit = query.limit ? parseInt(query.limit, 10) : 12;
        const data = await this.service.getAnalytics(query.regionLevel, query.regionName, query.periodType, limit);
        return { data, count: data.length };
    }
    async getHistory(id, query, req) {
        const limit = query.limit ? parseInt(query.limit, 10) : 20;
        const data = await this.service.getHistory(id, req.user.id, limit);
        return { data, count: data.length };
    }
    async recalculate(id, req) {
        const data = await this.service.assess(id, req.user.id);
        return { message: 'Yield intelligence recalculated successfully', data };
    }
    async recalculateAll() {
        const result = await this.service.runBulkAssessment();
        await this.service.refreshAnalytics();
        return {
            message: `Bulk assessment complete: ${result.assessed} assessed, ${result.failed} failed`,
            ...result,
        };
    }
    async getAssessment(id, req) {
        const data = await this.service.getAssessment(id, req.user.id);
        return { data };
    }
};
exports.YieldIntelligenceController = YieldIntelligenceController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all active yield assessments for the authenticated user',
        description: 'Returns the latest yield intelligence assessment for every active farmer crop belonging to the authenticated user.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All assessments returned.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('risk/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get yield risk analysis for a farmer crop' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getRisk", null);
__decorate([
    (0, common_1.Get)('confidence/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get yield confidence for a farmer crop' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getConfidence", null);
__decorate([
    (0, common_1.Get)('loss/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get yield loss estimate for a farmer crop' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getLoss", null);
__decorate([
    (0, common_1.Get)('regional'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get regional yield summary' }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: true, enum: ['village', 'taluk', 'district', 'state'], example: 'district' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: true, description: 'Region name', example: 'Bengaluru Urban' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [yield_query_dto_1.RegionalQueryDto]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getRegional", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get yield analytics and trends' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [yield_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('history/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get yield prediction history for a farmer crop' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, yield_query_dto_1.HistoryQueryDto, Object]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('recalculate/:farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Force recalculate yield intelligence for a farmer crop' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "recalculate", null);
__decorate([
    (0, common_1.Post)('recalculate-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger bulk yield assessment for all active crops' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "recalculateAll", null);
__decorate([
    (0, common_1.Get)(':farmerCropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get complete yield intelligence for a farmer crop',
        description: 'Returns full explainable yield intelligence: yield, risk, confidence, quality, loss, and recommendations.',
    }),
    (0, swagger_1.ApiParam)({ name: 'farmerCropId', description: 'ID of the farmer crop', example: '1' }),
    __param(0, (0, common_1.Param)('farmerCropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], YieldIntelligenceController.prototype, "getAssessment", null);
exports.YieldIntelligenceController = YieldIntelligenceController = __decorate([
    (0, swagger_1.ApiTags)('Yield Intelligence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('yield-intelligence'),
    __metadata("design:paramtypes", [yield_intelligence_service_1.YieldIntelligenceService])
], YieldIntelligenceController);
//# sourceMappingURL=yield-intelligence.controller.js.map