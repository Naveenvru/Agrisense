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
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const storage_registry_1 = require("./storage.registry");
let StorageService = StorageService_1 = class StorageService {
    registry;
    logger = new common_1.Logger(StorageService_1.name);
    constructor(registry) {
        this.registry = registry;
    }
    async save(location, content, options, providerName) {
        const start = Date.now();
        const provider = this.resolveProvider(providerName);
        this.logger.log(`SAVE | provider=${provider.providerName} tier=${location.tier} domain=${location.domain} file=${location.filename}`);
        const result = await provider.save(location, content, options);
        this.logger.log(`SAVE complete | ${Date.now() - start}ms | success=${result.success}`);
        return result;
    }
    async read(location, options, providerName) {
        const start = Date.now();
        const provider = this.resolveProvider(providerName);
        this.logger.log(`READ | provider=${provider.providerName} tier=${location.tier} domain=${location.domain} file=${location.filename}`);
        const result = await provider.read(location, options);
        this.logger.log(`READ complete | ${Date.now() - start}ms | success=${result.success}`);
        return result;
    }
    async delete(location, providerName) {
        const start = Date.now();
        const provider = this.resolveProvider(providerName);
        this.logger.log(`DELETE | provider=${provider.providerName} tier=${location.tier} domain=${location.domain} file=${location.filename}`);
        const result = await provider.delete(location);
        this.logger.log(`DELETE complete | ${Date.now() - start}ms | success=${result.success}`);
        return result;
    }
    async exists(location, providerName) {
        const provider = this.resolveProvider(providerName);
        return provider.exists(location);
    }
    async list(tier, domain, options, providerName) {
        const provider = this.resolveProvider(providerName);
        return provider.list(tier, domain, options);
    }
    resolveProvider(name) {
        const provider = name ? this.registry.get(name) : this.registry.getDefault();
        if (!provider) {
            throw new common_1.NotFoundException(`Storage provider "${name ?? 'default'}" is not registered.`);
        }
        return provider;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_registry_1.StorageRegistry])
], StorageService);
//# sourceMappingURL=storage.service.js.map