export declare const STORAGE_ROOT: string;
export declare const STORAGE_CONSTANTS: {
    readonly PROVIDERS: {
        readonly LOCAL: "local";
        readonly IPFS: "ipfs";
        readonly AWS_S3: "aws_s3";
        readonly AZURE_BLOB: "azure_blob";
        readonly GOOGLE_GCS: "google_gcs";
    };
    readonly TIERS: {
        readonly RAW: "raw";
        readonly PROCESSED: "processed";
        readonly ARCHIVE: "archive";
        readonly REPORTS: "reports";
    };
    readonly DOMAINS: {
        readonly WEATHER: "weather";
        readonly MARKET: "market";
        readonly GOVERNMENT: "government";
        readonly SOIL: "soil";
        readonly SENSOR: "sensor";
    };
    readonly LIMITS: {
        readonly MAX_FILE_SIZE_BYTES: number;
        readonly MAX_FILES_PER_DIR: 10000;
    };
    readonly RETENTION: {
        readonly RAW_DAYS: 90;
        readonly PROCESSED_DAYS: 180;
        readonly ARCHIVE_DAYS: 365;
    };
    readonly EXTENSIONS: {
        readonly JSON: ".json";
        readonly CSV: ".csv";
        readonly XML: ".xml";
        readonly PARQUET: ".parquet";
    };
};
export type StorageProviderName = (typeof STORAGE_CONSTANTS.PROVIDERS)[keyof typeof STORAGE_CONSTANTS.PROVIDERS];
export type StorageTier = (typeof STORAGE_CONSTANTS.TIERS)[keyof typeof STORAGE_CONSTANTS.TIERS];
export type StorageDomain = (typeof STORAGE_CONSTANTS.DOMAINS)[keyof typeof STORAGE_CONSTANTS.DOMAINS];
