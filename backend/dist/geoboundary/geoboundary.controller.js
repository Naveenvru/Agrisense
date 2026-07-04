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
exports.GeoBoundaryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const geoboundary_service_1 = require("./geoboundary.service");
const geoboundary_dto_1 = require("./dto/geoboundary.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let GeoBoundaryController = class GeoBoundaryController {
    geoboundaryService;
    constructor(geoboundaryService) {
        this.geoboundaryService = geoboundaryService;
    }
    health() {
        return this.geoboundaryService.healthCheck();
    }
    async reverseGeocode(query) {
        return this.geoboundaryService.resolveLocation(query.lat, query.lon);
    }
    async getBoundaryPolygon(query) {
        return this.geoboundaryService.resolveBoundaryPolygon(query.adminLevel, query.name);
    }
};
exports.GeoBoundaryController = GeoBoundaryController;
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'GeoBoundary module health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Module status returned.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeoBoundaryController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('reverse'),
    (0, swagger_1.ApiOperation)({ summary: 'Reverse geocode coordinates to administrative boundaries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'GeoBoundary Result containing resolved IDs and strings.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [geoboundary_dto_1.ReverseGeocodeDto]),
    __metadata("design:returntype", Promise)
], GeoBoundaryController.prototype, "reverseGeocode", null);
__decorate([
    (0, common_1.Get)('polygon'),
    (0, swagger_1.ApiOperation)({
        summary: 'Fetch GeoJSON boundary polygon for an administrative unit',
        description: `
Resolves and returns the GeoJSON boundary polygon for a named administrative unit.

**Administrative Levels supported:**
- \`country\` — National boundary
- \`state\` — State/province boundary
- \`district\` — District boundary
- \`taluk\` — Sub-district/taluk boundary
- \`village\` — Village boundary

**Cache Strategy (two-level):**
1. L1 — In-memory Map (process-scoped, sub-millisecond)
2. L2 — MongoDB GeoBoundaryCache (persistent, shared across restarts)
3. L3 — External geocoding provider (only on full cache miss)

**Example:** \`GET /geoboundary/polygon?adminLevel=district&name=Bengaluru Urban\`
    `.trim(),
    }),
    (0, swagger_1.ApiQuery)({ name: 'adminLevel', enum: ['village', 'taluk', 'district', 'state', 'country'], required: true }),
    (0, swagger_1.ApiQuery)({ name: 'name', type: String, required: true, example: 'Bengaluru Urban' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'GeoJSON Feature containing the boundary polygon geometry and properties.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Boundary polygon not found for the specified administrative unit.',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [geoboundary_dto_1.PolygonLookupDto]),
    __metadata("design:returntype", Promise)
], GeoBoundaryController.prototype, "getBoundaryPolygon", null);
exports.GeoBoundaryController = GeoBoundaryController = __decorate([
    (0, swagger_1.ApiTags)('GeoBoundary'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('geoboundary'),
    __metadata("design:paramtypes", [geoboundary_service_1.GeoBoundaryService])
], GeoBoundaryController);
//# sourceMappingURL=geoboundary.controller.js.map