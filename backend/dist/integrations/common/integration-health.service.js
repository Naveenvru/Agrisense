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
var IntegrationHealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationHealthService = void 0;
const common_1 = require("@nestjs/common");
const integration_registry_1 = require("./integration.registry");
const openweather_client_1 = require("../weather/openweather.client");
const integration_constants_1 = require("./integration.constants");
let IntegrationHealthService = IntegrationHealthService_1 = class IntegrationHealthService {
    registry;
    openWeatherClient;
    logger = new common_1.Logger(IntegrationHealthService_1.name);
    constructor(registry, openWeatherClient) {
        this.registry = registry;
        this.openWeatherClient = openWeatherClient;
    }
    onModuleInit() {
        this.registry.register(integration_constants_1.INTEGRATION_CONSTANTS.PROVIDERS.OPENWEATHER, this.openWeatherClient);
        this.logger.log(`IntegrationHealthService initialised. Registered providers: [${this.registry.getRegisteredNames().join(', ')}]`);
    }
    async checkAll() {
        this.logger.log('Running health checks on all registered providers...');
        const results = await this.registry.healthCheckAll();
        for (const r of results) {
            if (r.healthy) {
                this.logger.log(`[${r.provider}] ✓ Healthy | latency=${r.latencyMs ?? '?'}ms`);
            }
            else {
                this.logger.warn(`[${r.provider}] ✗ Unhealthy | ${r.message ?? 'no details'}`);
            }
        }
        return results;
    }
    async checkOne(providerName) {
        const provider = this.registry.get(providerName);
        if (!provider) {
            return {
                provider: providerName,
                healthy: false,
                message: `Provider "${providerName}" is not registered.`,
                checkedAt: new Date(),
            };
        }
        return provider.health();
    }
    getRegisteredProviders() {
        return this.registry.getRegisteredNames();
    }
};
exports.IntegrationHealthService = IntegrationHealthService;
exports.IntegrationHealthService = IntegrationHealthService = IntegrationHealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [integration_registry_1.IntegrationRegistry,
        openweather_client_1.OpenWeatherClient])
], IntegrationHealthService);
//# sourceMappingURL=integration-health.service.js.map