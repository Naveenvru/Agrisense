import { IStorageProvider } from './storage-provider.interface';
import { StorageProviderInfo, StorageHealthResult } from './storage.types';
import { StorageProviderName } from './storage.constants';
export declare class StorageRegistry {
    private readonly logger;
    private readonly providers;
    private readonly providerInfos;
    private defaultProvider;
    register(info: StorageProviderInfo, provider: IStorageProvider): void;
    get(name?: StorageProviderName | string): IStorageProvider | undefined;
    getDefault(): IStorageProvider | undefined;
    getAll(): ReadonlyMap<string, IStorageProvider>;
    getRegisteredNames(): string[];
    getAllInfo(): StorageProviderInfo[];
    isRegistered(name: string): boolean;
    healthCheckAll(): Promise<StorageHealthResult[]>;
}
