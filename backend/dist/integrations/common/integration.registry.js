"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IntegrationRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationRegistry = void 0;
const common_1 = require("@nestjs/common");
let IntegrationRegistry = IntegrationRegistry_1 = class IntegrationRegistry {
    logger = new common_1.Logger(IntegrationRegistry_1.name);
    providers = new Map();
    register(name, provider) {
        this.providers.set(name, provider);
        this.logger.log(`Provider registered: "${name}"`);
    }
    get(name) {
        return this.providers.get(name);
    }
    getAll() {
        return this.providers;
    }
    getRegisteredNames() {
        return Array.from(this.providers.keys());
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
                    message: `Health check threw: ${error?.message}`,
                    checkedAt: new Date(),
                });
            }
        }
        return results;
    }
};
exports.IntegrationRegistry = IntegrationRegistry;
exports.IntegrationRegistry = IntegrationRegistry = IntegrationRegistry_1 = __decorate([
    (0, common_1.Injectable)()
], IntegrationRegistry);
//# sourceMappingURL=integration.registry.js.map