import { OnModuleInit } from '@nestjs/common';
import { IStorageProvider } from '../common/storage-provider.interface';
import { StorageLocation, StorageResult, StorageHealthResult, SaveOptions, ReadOptions, ListOptions } from '../common/storage.types';
export declare class LocalStorageProvider implements IStorageProvider, OnModuleInit {
    readonly providerName: "local";
    private readonly logger;
    onModuleInit(): void;
    save(location: StorageLocation, _content: string | Buffer, _options?: SaveOptions): Promise<StorageResult>;
    read(location: StorageLocation, _options?: ReadOptions): Promise<StorageResult<string | Buffer>>;
    delete(location: StorageLocation): Promise<StorageResult>;
    exists(location: StorageLocation): Promise<boolean>;
    list(tier: string, domain: string, options?: ListOptions): Promise<string[]>;
    health(): Promise<StorageHealthResult>;
    private resolvePath;
    private ensureDirectories;
    private isWritable;
}
