import { StorageService } from '../common/storage.service';
import { StorageResult } from '../common/storage.types';
import { StorageDomain } from '../common/storage.constants';
import { CollectionResult } from '../../collectors/common/collector.types';
export declare class DataLakeService {
    private readonly storageService;
    private readonly logger;
    constructor(storageService: StorageService);
    writeRaw(domain: StorageDomain, result: CollectionResult): Promise<StorageResult>;
    readRaw(domain: StorageDomain, filename: string): Promise<StorageResult>;
    archiveRaw(domain: StorageDomain, filename: string): Promise<StorageResult>;
    listRaw(domain: StorageDomain): Promise<string[]>;
    private generateFilename;
}
