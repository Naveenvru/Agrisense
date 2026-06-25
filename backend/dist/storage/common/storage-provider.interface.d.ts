import { StorageLocation, StorageResult, StorageHealthResult, SaveOptions, ReadOptions, ListOptions } from './storage.types';
export interface IStorageProvider {
    readonly providerName: string;
    save(location: StorageLocation, content: string | Buffer, options?: SaveOptions): Promise<StorageResult>;
    read(location: StorageLocation, options?: ReadOptions): Promise<StorageResult<string | Buffer>>;
    delete(location: StorageLocation): Promise<StorageResult>;
    exists(location: StorageLocation): Promise<boolean>;
    list(tier: string, domain: string, options?: ListOptions): Promise<string[]>;
    health(): Promise<StorageHealthResult>;
}
