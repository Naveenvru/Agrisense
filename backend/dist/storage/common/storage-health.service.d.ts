import { OnModuleInit } from '@nestjs/common';
import { StorageRegistry } from './storage.registry';
import { LocalStorageProvider } from '../local/local-storage.provider';
import { StorageHealthResult } from './storage.types';
export declare class StorageHealthService implements OnModuleInit {
    private readonly registry;
    private readonly localProvider;
    private readonly logger;
    constructor(registry: StorageRegistry, localProvider: LocalStorageProvider);
    onModuleInit(): void;
    checkAll(): Promise<StorageHealthResult[]>;
    checkOne(providerName: string): Promise<StorageHealthResult>;
    getRegisteredProviders(): string[];
}
