import { StorageProviderName, StorageTier, StorageDomain } from './storage.constants';
export interface StorageLocation {
    tier: StorageTier;
    domain: StorageDomain;
    filename: string;
    subPath?: string;
}
export interface StorageMetadata {
    id: string;
    filename: string;
    originalFilename: string;
    provider: StorageProviderName;
    path: string;
    extension: string;
    mimeType: string;
    size: number;
    checksum: string;
    createdAt: Date;
    updatedAt: Date;
    source: string;
    status: StorageFileStatus;
    version: number;
    tier: StorageTier;
    domain: StorageDomain;
    tags?: Record<string, string>;
}
export type StorageFileStatus = 'active' | 'archived' | 'deleted' | 'processing';
export interface StorageResult<T = unknown> {
    success: boolean;
    location?: StorageLocation;
    metadata?: StorageMetadata;
    data?: T;
    errorMessage?: string;
    durationMs: number;
}
export interface StorageProviderInfo {
    name: StorageProviderName;
    description: string;
    rootPath?: string;
    endpoint?: string;
    isDefault: boolean;
    supportsStreaming: boolean;
    supportsVersioning: boolean;
}
export interface StorageHealthResult {
    provider: StorageProviderName | string;
    healthy: boolean;
    writable: boolean;
    freeSpaceBytes: number;
    latencyMs: number;
    message?: string;
    checkedAt: Date;
}
export interface SaveOptions {
    overwrite?: boolean;
    tags?: Record<string, string>;
    mimeType?: string;
}
export interface ReadOptions {
    encoding?: BufferEncoding;
}
export interface ListOptions {
    extension?: string;
    limit?: number;
    sortBy?: 'name' | 'createdAt' | 'size';
    sortOrder?: 'asc' | 'desc';
}
