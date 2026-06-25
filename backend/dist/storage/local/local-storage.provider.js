"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var LocalStorageProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const storage_constants_1 = require("../common/storage.constants");
let LocalStorageProvider = LocalStorageProvider_1 = class LocalStorageProvider {
    providerName = storage_constants_1.STORAGE_CONSTANTS.PROVIDERS.LOCAL;
    logger = new common_1.Logger(LocalStorageProvider_1.name);
    onModuleInit() {
        this.ensureDirectories();
    }
    async save(location, _content, _options) {
        const filePath = this.resolvePath(location);
        this.logger.debug(`SAVE (stub) → ${filePath}`);
        return {
            success: false,
            location,
            errorMessage: 'LocalStorageProvider.save() — not yet implemented (Phase 8.8).',
            durationMs: 0,
        };
    }
    async read(location, _options) {
        const filePath = this.resolvePath(location);
        this.logger.debug(`READ (stub) → ${filePath}`);
        return {
            success: false,
            location,
            errorMessage: 'LocalStorageProvider.read() — not yet implemented (Phase 8.8).',
            durationMs: 0,
        };
    }
    async delete(location) {
        const filePath = this.resolvePath(location);
        this.logger.debug(`DELETE (stub) → ${filePath}`);
        return {
            success: false,
            location,
            errorMessage: 'LocalStorageProvider.delete() — not yet implemented (Phase 8.8).',
            durationMs: 0,
        };
    }
    async exists(location) {
        const filePath = this.resolvePath(location);
        return fs.existsSync(filePath);
    }
    async list(tier, domain, options) {
        const dirPath = path.join(storage_constants_1.STORAGE_ROOT, tier, domain);
        if (!fs.existsSync(dirPath)) {
            return [];
        }
        let files = fs.readdirSync(dirPath);
        if (options?.extension) {
            files = files.filter((f) => f.endsWith(options.extension));
        }
        if (options?.limit) {
            files = files.slice(0, options.limit);
        }
        return files;
    }
    async health() {
        const start = Date.now();
        try {
            const testPath = path.join(storage_constants_1.STORAGE_ROOT, 'raw', 'weather');
            const exists = fs.existsSync(testPath);
            const writable = this.isWritable(storage_constants_1.STORAGE_ROOT);
            return {
                provider: this.providerName,
                healthy: exists && writable,
                writable,
                freeSpaceBytes: -1,
                latencyMs: Date.now() - start,
                message: exists && writable ? 'Local storage is healthy.' : 'Storage directory not writable.',
                checkedAt: new Date(),
            };
        }
        catch (error) {
            return {
                provider: this.providerName,
                healthy: false,
                writable: false,
                freeSpaceBytes: -1,
                latencyMs: Date.now() - start,
                message: `Health check failed: ${error?.message}`,
                checkedAt: new Date(),
            };
        }
    }
    resolvePath(location) {
        const parts = [storage_constants_1.STORAGE_ROOT, location.tier, location.domain];
        if (location.subPath)
            parts.push(location.subPath);
        parts.push(location.filename);
        return path.join(...parts);
    }
    ensureDirectories() {
        const dirs = [];
        for (const tier of Object.values(storage_constants_1.STORAGE_CONSTANTS.TIERS)) {
            if (tier === 'raw') {
                for (const domain of Object.values(storage_constants_1.STORAGE_CONSTANTS.DOMAINS)) {
                    dirs.push(path.join(storage_constants_1.STORAGE_ROOT, tier, domain));
                }
            }
            else {
                dirs.push(path.join(storage_constants_1.STORAGE_ROOT, tier));
            }
        }
        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                this.logger.log(`Created storage directory: ${dir}`);
            }
        }
        this.logger.log(`LocalStorageProvider initialised | root=${storage_constants_1.STORAGE_ROOT}`);
    }
    isWritable(dirPath) {
        try {
            fs.accessSync(dirPath, fs.constants.W_OK);
            return true;
        }
        catch {
            return false;
        }
    }
};
exports.LocalStorageProvider = LocalStorageProvider;
exports.LocalStorageProvider = LocalStorageProvider = LocalStorageProvider_1 = __decorate([
    (0, common_1.Injectable)()
], LocalStorageProvider);
//# sourceMappingURL=local-storage.provider.js.map