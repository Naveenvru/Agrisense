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
exports.SupplyIntelligenceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const supply_intelligence_service_1 = require("./supply-intelligence.service");
const supply_query_dto_1 = require("./dto/supply-query.dto");
let SupplyIntelligenceController = class SupplyIntelligenceController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getSummary(req) {
        const assessments = await this.service.getSummary(req.user.id);
        return { data: assessments, count: assessments.length };
    }
    async getRisk(query, req) {
        const data = await this.service.getRisk(query.cropId, req.user.id);
        return { data };
    }
    async getTimeline(query, req) {
        const data = await this.service.getTimeline(query.cropId, req.user.id);
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
    async getAssessment(id, req) {
        const data = await this.service.getAssessment(id, req.user.id);
        return { data };
    }
    async recalculate(query, req) {
        if (query.cropId) {
            const data = await this.service.assess(query.cropId, req.user.id);
            return { message: 'Supply intelligence recalculated successfully', data };
        }
        const result = await this.service.runBulkAssessment(req.user.id);
        await this.service.refreshAnalytics();
        return { message: `Bulk supply recalculation complete: ${result.assessed} assessed, ${result.failed} failed`, ...result };
    }
    async recalculateAll() {
        const result = await this.service.runBulkAssessment();
        await this.service.refreshAnalytics();
        return {
            message: `Bulk assessment complete: ${result.assessed} assessed, ${result.failed} failed`,
            ...result,
        };
    }
};
exports.SupplyIntelligenceController = SupplyIntelligenceController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active supply assessments for the authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All assessments returned.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)('risk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get supply risk for one crop or the current user portfolio' }),
    (0, swagger_1.ApiQuery)({ name: 'cropId', required: false, description: 'Optional crop ID for a single crop risk view' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supply_query_dto_1.SupplyActionQueryDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "getRisk", null);
__decorate([
    (0, common_1.Get)('timeline'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get supply availability timeline for one crop or the current user portfolio' }),
    (0, swagger_1.ApiQuery)({ name: 'cropId', required: false, description: 'Optional crop ID for a single crop timeline view' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supply_query_dto_1.SupplyActionQueryDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "getTimeline", null);
__decorate([
    (0, common_1.Get)('regional'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get regional supply summary' }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: true, enum: ['village', 'taluk', 'district', 'state'], example: 'district' }),
    (0, swagger_1.ApiQuery)({ name: 'name', required: true, description: 'Region name', example: 'Bengaluru Urban' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supply_query_dto_1.RegionalQueryDto]),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "getRegional", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get supply analytics and trends' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supply_query_dto_1.AnalyticsQueryDto]),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)(':cropId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get complete supply intelligence for a farmer crop' }),
    (0, swagger_1.ApiParam)({ name: 'cropId', description: 'ID of the farmer crop', example: '1' }),
    __param(0, (0, common_1.Param)('cropId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "getAssessment", null);
__decorate([
    (0, common_1.Post)('recalculate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Recalculate supply intelligence for a crop or the current portfolio' }),
    (0, swagger_1.ApiQuery)({ name: 'cropId', required: false, description: 'Optional crop ID for a single crop recalculation' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supply_query_dto_1.SupplyActionQueryDto, Object]),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "recalculate", null);
__decorate([
    (0, common_1.Post)('recalculate-all'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger bulk supply assessment for all active crops' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplyIntelligenceController.prototype, "recalculateAll", null);
exports.SupplyIntelligenceController = SupplyIntelligenceController = __decorate([
    (0, swagger_1.ApiTags)('Supply Intelligence'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('supply-intelligence'),
    __metadata("design:paramtypes", [supply_intelligence_service_1.SupplyIntelligenceService])
], SupplyIntelligenceController);
//# sourceMappingURL=supply-intelligence.controller.js.map