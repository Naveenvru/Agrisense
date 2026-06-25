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
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_CONSTANTS = exports.STORAGE_ROOT = void 0;
const path = __importStar(require("path"));
exports.STORAGE_ROOT = path.resolve(process.cwd(), 'storage');
exports.STORAGE_CONSTANTS = {
    PROVIDERS: {
        LOCAL: 'local',
        IPFS: 'ipfs',
        AWS_S3: 'aws_s3',
        AZURE_BLOB: 'azure_blob',
        GOOGLE_GCS: 'google_gcs',
    },
    TIERS: {
        RAW: 'raw',
        PROCESSED: 'processed',
        ARCHIVE: 'archive',
        REPORTS: 'reports',
    },
    DOMAINS: {
        WEATHER: 'weather',
        MARKET: 'market',
        GOVERNMENT: 'government',
        SOIL: 'soil',
        SENSOR: 'sensor',
    },
    LIMITS: {
        MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024,
        MAX_FILES_PER_DIR: 10_000,
    },
    RETENTION: {
        RAW_DAYS: 90,
        PROCESSED_DAYS: 180,
        ARCHIVE_DAYS: 365,
    },
    EXTENSIONS: {
        JSON: '.json',
        CSV: '.csv',
        XML: '.xml',
        PARQUET: '.parquet',
    },
};
//# sourceMappingURL=storage.constants.js.map