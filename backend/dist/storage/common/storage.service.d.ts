import { StorageRegistry } from './storage.registry';
import { StorageLocation, StorageResult, SaveOptions, ReadOptions, ListOptions } from './storage.types';
import { StorageProviderName } from './storage.constants';
export declare class StorageService {
    private readonly registry;
    private readonly logger;
    constructor(registry: StorageRegistry);
    save(location: StorageLocation, content: string | Buffer, options?: SaveOptions, providerName?: StorageProviderName | string): Promise<StorageResult>;
    read(location: StorageLocation, options?: ReadOptions, providerName?: StorageProviderName | string): Promise<StorageResult<string | Buffer>>;
    delete(location: StorageLocation, providerName?: StorageProviderName | string): Promise<StorageResult>;
    exists(location: StorageLocation, providerName?: StorageProviderName | string): Promise<boolean>;
    list(tier: string, domain: string, options?: ListOptions, providerName?: StorageProviderName | string): Promise<string[]>;
    private resolveProvider;
}
