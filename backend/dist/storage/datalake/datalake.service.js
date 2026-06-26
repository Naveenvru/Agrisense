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
var DataLakeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLakeService = void 0;
const common_1 = require("@nestjs/common");
const storage_service_1 = require("../common/storage.service");
const storage_constants_1 = require("../common/storage.constants");
const datalake_types_1 = require("./datalake.types");
let DataLakeService = DataLakeService_1 = class DataLakeService {
    storageService;
    logger = new common_1.Logger(DataLakeService_1.name);
    metadataIndex = new Map();
    constructor(storageService) {
        this.storageService = storageService;
    }
    async save(tier, domain, content, options) {
        const format = options?.format ?? 'json';
        const filename = options?.filename ?? this.generateFilename(domain, format);
        const location = { tier, domain, filename };
        const saveOpts = {
            mimeType: datalake_types_1.FORMAT_MIME[format],
            tags: {
                ...(options?.tags ?? {}),
                source: options?.source ?? 'unknown',
                format,
                domain,
                tier,
            },
        };
        const result = await this.storageService.save(location, content, saveOpts);
        if (result.success && result.metadata) {
            this.indexPut(tier, domain, filename, result.metadata);
            this.logger.log(`FILE STORED | tier=${tier} domain=${domain} file=${filename} size=${result.metadata.size}B checksum=${result.metadata.checksum.substring(0, 12)}...`);
        }
        return result;
    }
    async read(tier, domain, filename) {
        const location = { tier, domain, filename };
        const result = await this.storageService.read(location, { encoding: 'utf8' });
        if (!result.success || result.data === undefined) {
            this.logger.warn(`FILE READ FAILED | tier=${tier} domain=${domain} file=${filename} | ${result.errorMessage}`);
            return null;
        }
        const indexedMeta = this.indexGet(tier, domain, filename);
        const metadata = indexedMeta ?? result.metadata;
        if (!metadata) {
            this.logger.warn(`FILE READ | no metadata available for ${tier}/${domain}/${filename}`);
            return null;
        }
        this.indexPut(tier, domain, filename, metadata);
        const ext = filename.split('.').pop() ?? 'json';
        const format = this.extToFormat(ext);
        this.logger.log(`FILE READ | tier=${tier} domain=${domain} file=${filename} size=${metadata.size}B`);
        return {
            content: result.data,
            metadata,
            format,
        };
    }
    async exists(tier, domain, filename) {
        if (this.metadataIndex.has(this.indexKey(tier, domain, filename))) {
            return true;
        }
        const location = { tier, domain, filename };
        return this.storageService.exists(location);
    }
    async delete(tier, domain, filename) {
        const location = { tier, domain, filename };
        const result = await this.storageService.delete(location);
        if (result.success) {
            this.indexEvict(tier, domain, filename);
            this.logger.log(`FILE DELETED | tier=${tier} domain=${domain} file=${filename}`);
        }
        return result;
    }
    async list(tier, domain, options) {
        const files = await this.storageService.list(tier, domain, {
            extension: options?.extension,
            limit: options?.limit,
            sortBy: 'name',
            sortOrder: 'asc',
        });
        return files.map((filename) => ({
            filename,
            metadata: this.indexGet(tier, domain, filename),
        }));
    }
    async archive(sourceTier, domain, filename) {
        const start = Date.now();
        const sourceLocation = {
            tier: sourceTier,
            domain,
            filename,
        };
        const archiveLocation = {
            tier: storage_constants_1.STORAGE_CONSTANTS.TIERS.ARCHIVE,
            domain,
            filename,
        };
        const sourcePath = `${sourceTier}/${domain}/${filename}`;
        const archivePath = `archive/${domain}/${filename}`;
        try {
            const readResult = await this.storageService.read(sourceLocation, {
                encoding: 'utf8',
            });
            if (!readResult.success || readResult.data === undefined) {
                return {
                    success: false,
                    sourcePath,
                    archivePath,
                    durationMs: Date.now() - start,
                    errorMessage: `Archive read failed: ${readResult.errorMessage}`,
                };
            }
            const sourceMeta = this.indexGet(sourceTier, domain, filename);
            const saveResult = await this.storageService.save(archiveLocation, readResult.data, {
                overwrite: true,
                mimeType: sourceMeta?.mimeType,
                tags: {
                    ...(sourceMeta?.tags ?? {}),
                    archivedFrom: sourcePath,
                    archivedAt: new Date().toISOString(),
                },
            });
            if (!saveResult.success) {
                return {
                    success: false,
                    sourcePath,
                    archivePath,
                    durationMs: Date.now() - start,
                    errorMessage: `Archive write failed: ${saveResult.errorMessage}`,
                };
            }
            const deleteResult = await this.storageService.delete(sourceLocation);
            if (!deleteResult.success) {
                return {
                    success: false,
                    sourcePath,
                    archivePath,
                    durationMs: Date.now() - start,
                    errorMessage: `Archive cleanup failed (file copied but not deleted): ${deleteResult.errorMessage}`,
                };
            }
            this.indexEvict(sourceTier, domain, filename);
            if (saveResult.metadata) {
                this.indexPut(storage_constants_1.STORAGE_CONSTANTS.TIERS.ARCHIVE, domain, filename, saveResult.metadata);
            }
            this.logger.log(`FILE ARCHIVED | ${sourcePath} → ${archivePath} | ${Date.now() - start}ms`);
            return {
                success: true,
                sourcePath,
                archivePath,
                durationMs: Date.now() - start,
            };
        }
        catch (error) {
            this.logger.error(`ARCHIVE FAILED | ${sourcePath} → ${archivePath} | ${error?.message}`);
            return {
                success: false,
                sourcePath,
                archivePath,
                durationMs: Date.now() - start,
                errorMessage: `Archive failed: ${error?.message}`,
            };
        }
    }
    async writeRaw(domain, result) {
        const filename = this.generateFilenameFromCollection(domain, result);
        const content = JSON.stringify(result, null, 2);
        const storageResult = await this.save(storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW, domain, content, {
            format: 'json',
            source: result.provider,
            filename,
            tags: {
                provider: result.provider,
                operation: result.operation,
                status: result.status,
                collectedAt: result.collectedAt.toISOString(),
            },
        });
        return storageResult;
    }
    async readRaw(domain, filename) {
        const location = {
            tier: storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW,
            domain,
            filename,
        };
        const result = await this.storageService.read(location, {
            encoding: 'utf8',
        });
        if (result.success) {
            this.logger.log(`FILE READ | tier=raw domain=${domain} file=${filename}`);
        }
        return result;
    }
    async archiveRaw(domain, filename) {
        const archiveResult = await this.archive(storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW, domain, filename);
        return {
            success: archiveResult.success,
            errorMessage: archiveResult.errorMessage,
            durationMs: archiveResult.durationMs,
        };
    }
    async listRaw(domain) {
        const entries = await this.list(storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW, domain);
        return entries.map((e) => e.filename);
    }
    indexKey(tier, domain, filename) {
        return `${tier}/${domain}/${filename}`;
    }
    indexPut(tier, domain, filename, metadata) {
        this.metadataIndex.set(this.indexKey(tier, domain, filename), metadata);
    }
    indexGet(tier, domain, filename) {
        return this.metadataIndex.get(this.indexKey(tier, domain, filename));
    }
    indexEvict(tier, domain, filename) {
        this.metadataIndex.delete(this.indexKey(tier, domain, filename));
    }
    generateFilename(domain, format) {
        const ts = new Date()
            .toISOString()
            .replace(/[-:]/g, '')
            .replace(/\.\d{3}Z$/, '');
        return `${domain}_${ts}${datalake_types_1.FORMAT_EXT[format]}`;
    }
    generateFilenameFromCollection(domain, result) {
        const ts = result.collectedAt.getTime();
        const sanitize = (s) => s.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
        return `${sanitize(domain)}_${sanitize(result.provider)}_${sanitize(result.operation)}_${ts}.json`;
    }
    extToFormat(ext) {
        const map = {
            json: 'json',
            csv: 'csv',
            xml: 'xml',
        };
        return map[ext.toLowerCase()] ?? 'json';
    }
};
exports.DataLakeService = DataLakeService;
exports.DataLakeService = DataLakeService = DataLakeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], DataLakeService);
//# sourceMappingURL=datalake.service.js.map