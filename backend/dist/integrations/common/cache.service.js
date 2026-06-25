"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const common_1 = require("@nestjs/common");
let CacheService = CacheService_1 = class CacheService {
    logger = new common_1.Logger(CacheService_1.name);
    store = new Map();
    set(key, value, options) {
        const expiresAt = Date.now() + options.ttlMs;
        this.store.set(key, { value, expiresAt });
        this.logger.debug(`Cache SET | key="${key}" ttlMs=${options.ttlMs}`);
    }
    get(key) {
        const entry = this.store.get(key);
        if (!entry) {
            this.logger.debug(`Cache MISS | key="${key}" (not found)`);
            return null;
        }
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            this.logger.debug(`Cache MISS | key="${key}" (expired)`);
            return null;
        }
        this.logger.debug(`Cache HIT  | key="${key}"`);
        return entry.value;
    }
    delete(key) {
        this.store.delete(key);
        this.logger.debug(`Cache DELETE | key="${key}"`);
    }
    evictExpired() {
        const now = Date.now();
        let evicted = 0;
        for (const [key, entry] of this.store.entries()) {
            if (now > entry.expiresAt) {
                this.store.delete(key);
                evicted++;
            }
        }
        if (evicted > 0) {
            this.logger.log(`Cache eviction: removed ${evicted} expired entries.`);
        }
        return evicted;
    }
    size() {
        return this.store.size;
    }
    has(key) {
        return this.get(key) !== null;
    }
};
exports.CacheService = CacheService;
exports.CacheService = CacheService = CacheService_1 = __decorate([
    (0, common_1.Injectable)()
], CacheService);
//# sourceMappingURL=cache.service.js.map