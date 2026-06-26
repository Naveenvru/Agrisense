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
const fsp = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const storage_constants_1 = require("../common/storage.constants");
let LocalStorageProvider = LocalStorageProvider_1 = class LocalStorageProvider {
    providerName = storage_constants_1.STORAGE_CONSTANTS.PROVIDERS.LOCAL;
    logger = new common_1.Logger(LocalStorageProvider_1.name);
    onModuleInit() {
        this.ensureDirectories();
    }
    async save(location, content, options) {
        const start = Date.now();
        const filePath = this.resolvePath(location);
        try {
            const byteLength = Buffer.isBuffer(content)
                ? content.length
                : Buffer.byteLength(content, 'utf8');
            if (byteLength > storage_constants_1.STORAGE_CONSTANTS.LIMITS.MAX_FILE_SIZE_BYTES) {
                return {
                    success: false,
                    location,
                    errorMessage: `File exceeds maximum size of ${storage_constants_1.STORAGE_CONSTANTS.LIMITS.MAX_FILE_SIZE_BYTES} bytes (got ${byteLength} bytes).`,
                    durationMs: Date.now() - start,
                };
            }
            if (!options?.overwrite && fs.existsSync(filePath)) {
                return {
                    success: false,
                    location,
                    errorMessage: `File already exists at ${filePath}. Pass overwrite=true to replace it.`,
                    durationMs: Date.now() - start,
                };
            }
            await fsp.mkdir(path.dirname(filePath), { recursive: true });
            await fsp.writeFile(filePath, content, 'utf8');
            const contentBuffer = Buffer.isBuffer(content)
                ? content
                : Buffer.from(content, 'utf8');
            const checksum = crypto
                .createHash('sha256')
                .update(contentBuffer)
                .digest('hex');
            const stat = await fsp.stat(filePath);
            const ext = path.extname(location.filename);
            const now = new Date();
            const metadata = {
                id: `${location.tier}-${location.domain}-${location.filename}-${Date.now()}`,
                filename: location.filename,
                originalFilename: location.filename,
                provider: this.providerName,
                path: filePath,
                extension: ext,
                mimeType: options?.mimeType ?? this.resolveMimeType(ext),
                size: stat.size,
                checksum,
                createdAt: now,
                updatedAt: now,
                source: options?.tags?.source ?? 'unknown',
                status: 'active',
                version: 1,
                tier: location.tier,
                domain: location.domain,
                tags: options?.tags,
            };
            this.logger.log(`FILE STORED | provider=local tier=${location.tier} domain=${location.domain} file=${location.filename} size=${stat.size}B checksum=${checksum.substring(0, 12)}...`);
            return {
                success: true,
                location,
                metadata,
                durationMs: Date.now() - start,
            };
        }
        catch (error) {
            this.logger.error(`SAVE FAILED | file=${location.filename} error=${error?.message}`);
            return {
                success: false,
                location,
                errorMessage: `Save failed: ${error?.message}`,
                durationMs: Date.now() - start,
            };
        }
    }
    async read(location, options) {
        const start = Date.now();
        const filePath = this.resolvePath(location);
        try {
            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    location,
                    errorMessage: `File not found: ${filePath}`,
                    durationMs: Date.now() - start,
                };
            }
            const encoding = options?.encoding ?? 'utf8';
            const raw = await fsp.readFile(filePath, encoding);
            const contentBuffer = Buffer.isBuffer(raw)
                ? raw
                : Buffer.from(raw, 'utf8');
            const checksum = crypto
                .createHash('sha256')
                .update(contentBuffer)
                .digest('hex');
            const stat = await fsp.stat(filePath);
            const ext = path.extname(location.filename);
            const now = new Date();
            const metadata = {
                id: `${location.tier}-${location.domain}-${location.filename}`,
                filename: location.filename,
                originalFilename: location.filename,
                provider: this.providerName,
                path: filePath,
                extension: ext,
                mimeType: this.resolveMimeType(ext),
                size: stat.size,
                checksum,
                createdAt: stat.birthtime,
                updatedAt: stat.mtime,
                source: 'unknown',
                status: 'active',
                version: 1,
                tier: location.tier,
                domain: location.domain,
            };
            this.logger.log(`FILE READ | provider=local tier=${location.tier} domain=${location.domain} file=${location.filename} size=${stat.size}B`);
            return {
                success: true,
                location,
                metadata,
                data: raw,
                durationMs: Date.now() - start,
            };
        }
        catch (error) {
            this.logger.error(`READ FAILED | file=${location.filename} error=${error?.message}`);
            return {
                success: false,
                location,
                errorMessage: `Read failed: ${error?.message}`,
                durationMs: Date.now() - start,
            };
        }
    }
    async delete(location) {
        const start = Date.now();
        const filePath = this.resolvePath(location);
        try {
            if (!fs.existsSync(filePath)) {
                return {
                    success: false,
                    location,
                    errorMessage: `File not found for deletion: ${filePath}`,
                    durationMs: Date.now() - start,
                };
            }
            await fsp.unlink(filePath);
            this.logger.log(`FILE DELETED | provider=local tier=${location.tier} domain=${location.domain} file=${location.filename}`);
            return {
                success: true,
                location,
                durationMs: Date.now() - start,
            };
        }
        catch (error) {
            this.logger.error(`DELETE FAILED | file=${location.filename} error=${error?.message}`);
            return {
                success: false,
                location,
                errorMessage: `Delete failed: ${error?.message}`,
                durationMs: Date.now() - start,
            };
        }
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
        let files = fs.readdirSync(dirPath).filter((f) => {
            const fullPath = path.join(dirPath, f);
            return fs.statSync(fullPath).isFile();
        });
        if (options?.extension) {
            files = files.filter((f) => f.endsWith(options.extension));
        }
        if (options?.sortBy === 'createdAt' || options?.sortBy === 'size') {
            files = files.sort((a, b) => {
                const statA = fs.statSync(path.join(dirPath, a));
                const statB = fs.statSync(path.join(dirPath, b));
                const valA = options.sortBy === 'createdAt'
                    ? statA.birthtimeMs
                    : statA.size;
                const valB = options.sortBy === 'createdAt'
                    ? statB.birthtimeMs
                    : statB.size;
                return options.sortOrder === 'desc' ? valB - valA : valA - valB;
            });
        }
        else if (options?.sortBy === 'name') {
            files = files.sort((a, b) => options.sortOrder === 'desc' ? b.localeCompare(a) : a.localeCompare(b));
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
                message: exists && writable
                    ? 'Local storage is healthy.'
                    : 'Storage directory not writable.',
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
            if (tier === storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW) {
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
    resolveMimeType(ext) {
        const mimeMap = {
            '.json': 'application/json',
            '.csv': 'text/csv',
            '.xml': 'application/xml',
            '.txt': 'text/plain',
        };
        return mimeMap[ext] ?? 'application/octet-stream';
    }
};
exports.LocalStorageProvider = LocalStorageProvider;
exports.LocalStorageProvider = LocalStorageProvider = LocalStorageProvider_1 = __decorate([
    (0, common_1.Injectable)()
], LocalStorageProvider);
//# sourceMappingURL=local-storage.provider.js.map