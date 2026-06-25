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
let DataLakeService = DataLakeService_1 = class DataLakeService {
    storageService;
    logger = new common_1.Logger(DataLakeService_1.name);
    constructor(storageService) {
        this.storageService = storageService;
    }
    async writeRaw(domain, result) {
        const filename = this.generateFilename(domain, result);
        const location = {
            tier: storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW,
            domain,
            filename,
        };
        this.logger.log(`DataLakeService.writeRaw (stub) | domain=${domain} file=${filename}`);
        return {
            success: false,
            location,
            errorMessage: 'DataLakeService.writeRaw() — not yet implemented (Phase 8.8).',
            durationMs: 0,
        };
    }
    async readRaw(domain, filename) {
        const location = {
            tier: storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW,
            domain,
            filename,
        };
        this.logger.log(`DataLakeService.readRaw (stub) | domain=${domain} file=${filename}`);
        return {
            success: false,
            location,
            errorMessage: 'DataLakeService.readRaw() — not yet implemented (Phase 8.8).',
            durationMs: 0,
        };
    }
    async archiveRaw(domain, filename) {
        this.logger.log(`DataLakeService.archiveRaw (stub) | domain=${domain} file=${filename}`);
        return {
            success: false,
            errorMessage: 'DataLakeService.archiveRaw() — not yet implemented (Phase 8.8).',
            durationMs: 0,
        };
    }
    async listRaw(domain) {
        return this.storageService.list(storage_constants_1.STORAGE_CONSTANTS.TIERS.RAW, domain);
    }
    generateFilename(domain, result) {
        const ts = result.collectedAt.getTime();
        const sanitize = (s) => s.replace(/[^a-z0-9_]/gi, '_').toLowerCase();
        return `${sanitize(domain)}_${sanitize(result.provider)}_${sanitize(result.operation)}_${ts}.json`;
    }
};
exports.DataLakeService = DataLakeService;
exports.DataLakeService = DataLakeService = DataLakeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], DataLakeService);
//# sourceMappingURL=datalake.service.js.map