import { StorageService } from '../common/storage.service';
import { StorageResult } from '../common/storage.types';
import { StorageDomain, StorageTier } from '../common/storage.constants';
import { CollectionResult } from '../../collectors/common/collector.types';
import { DataLakeSaveOptions, DataLakeReadResult, DataLakeListEntry, DataLakeArchiveResult } from './datalake.types';
export declare class DataLakeService {
    private readonly storageService;
    private readonly logger;
    private readonly metadataIndex;
    constructor(storageService: StorageService);
    save(tier: StorageTier, domain: StorageDomain, content: string | Buffer, options?: DataLakeSaveOptions): Promise<StorageResult>;
    read(tier: StorageTier, domain: StorageDomain, filename: string): Promise<DataLakeReadResult | null>;
    exists(tier: StorageTier, domain: StorageDomain, filename: string): Promise<boolean>;
    delete(tier: StorageTier, domain: StorageDomain, filename: string): Promise<StorageResult>;
    list(tier: StorageTier, domain: StorageDomain, options?: {
        extension?: string;
        limit?: number;
    }): Promise<DataLakeListEntry[]>;
    archive(sourceTier: StorageTier, domain: StorageDomain, filename: string): Promise<DataLakeArchiveResult>;
    writeRaw(domain: StorageDomain, result: CollectionResult): Promise<StorageResult>;
    readRaw(domain: StorageDomain, filename: string): Promise<StorageResult>;
    archiveRaw(domain: StorageDomain, filename: string): Promise<StorageResult>;
    listRaw(domain: StorageDomain): Promise<string[]>;
    private indexKey;
    private indexPut;
    private indexGet;
    private indexEvict;
    private generateFilename;
    private generateFilenameFromCollection;
    private extToFormat;
}
