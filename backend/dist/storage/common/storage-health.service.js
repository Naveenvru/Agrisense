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
var StorageHealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageHealthService = void 0;
const common_1 = require("@nestjs/common");
const storage_registry_1 = require("./storage.registry");
const local_storage_provider_1 = require("../local/local-storage.provider");
const storage_constants_1 = require("./storage.constants");
let StorageHealthService = StorageHealthService_1 = class StorageHealthService {
    registry;
    localProvider;
    logger = new common_1.Logger(StorageHealthService_1.name);
    constructor(registry, localProvider) {
        this.registry = registry;
        this.localProvider = localProvider;
    }
    onModuleInit() {
        this.registry.register({
            name: storage_constants_1.STORAGE_CONSTANTS.PROVIDERS.LOCAL,
            description: 'Local filesystem storage',
            rootPath: 'storage/',
            isDefault: true,
            supportsStreaming: false,
            supportsVersioning: false,
        }, this.localProvider);
        this.logger.log(`StorageHealthService initialised. Registered providers: [${this.registry.getRegisteredNames().join(', ')}]`);
    }
    async checkAll() {
        this.logger.log('Running storage health checks...');
        const results = await this.registry.healthCheckAll();
        for (const r of results) {
            if (r.healthy) {
                this.logger.log(`[${r.provider}] ✓ Healthy | writable=${r.writable} | latency=${r.latencyMs}ms`);
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
                writable: false,
                freeSpaceBytes: -1,
                latencyMs: -1,
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
exports.StorageHealthService = StorageHealthService;
exports.StorageHealthService = StorageHealthService = StorageHealthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_registry_1.StorageRegistry,
        local_storage_provider_1.LocalStorageProvider])
], StorageHealthService);
//# sourceMappingURL=storage-health.service.js.map