"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StorageRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageRegistry = void 0;
const common_1 = require("@nestjs/common");
let StorageRegistry = StorageRegistry_1 = class StorageRegistry {
    logger = new common_1.Logger(StorageRegistry_1.name);
    providers = new Map();
    providerInfos = new Map();
    defaultProvider = 'local';
    register(info, provider) {
        this.providers.set(info.name, provider);
        this.providerInfos.set(info.name, info);
        if (info.isDefault) {
            this.defaultProvider = info.name;
        }
        this.logger.log(`Storage provider registered: "${info.name}" | default=${info.isDefault}`);
    }
    get(name) {
        const key = name ?? this.defaultProvider;
        const provider = this.providers.get(key);
        if (!provider) {
            this.logger.warn(`Storage provider "${key}" is not registered. Available: [${this.getRegisteredNames().join(', ')}]`);
        }
        return provider;
    }
    getDefault() {
        return this.providers.get(this.defaultProvider);
    }
    getAll() {
        return this.providers;
    }
    getRegisteredNames() {
        return Array.from(this.providers.keys());
    }
    getAllInfo() {
        return Array.from(this.providerInfos.values());
    }
    isRegistered(name) {
        return this.providers.has(name);
    }
    async healthCheckAll() {
        const results = [];
        for (const [name, provider] of this.providers) {
            try {
                const result = await provider.health();
                results.push(result);
            }
            catch (error) {
                results.push({
                    provider: name,
                    healthy: false,
                    writable: false,
                    freeSpaceBytes: -1,
                    latencyMs: -1,
                    message: `Health check threw: ${error?.message}`,
                    checkedAt: new Date(),
                });
            }
        }
        return results;
    }
};
exports.StorageRegistry = StorageRegistry;
exports.StorageRegistry = StorageRegistry = StorageRegistry_1 = __decorate([
    (0, common_1.Injectable)()
], StorageRegistry);
//# sourceMappingURL=storage.registry.js.map