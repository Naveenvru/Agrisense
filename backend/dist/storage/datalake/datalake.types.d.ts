import { StorageMetadata } from '../common/storage.types';
export type DataLakeFormat = 'json' | 'csv' | 'xml';
export interface DataLakeSaveOptions {
    format?: DataLakeFormat;
    source?: string;
    tags?: Record<string, string>;
    filename?: string;
}
export interface DataLakeReadResult {
    content: string;
    metadata: StorageMetadata;
    format: DataLakeFormat;
}
export interface DataLakeListEntry {
    filename: string;
    metadata?: StorageMetadata;
}
export interface DataLakeArchiveResult {
    success: boolean;
    sourcePath: string;
    archivePath: string;
    durationMs: number;
    errorMessage?: string;
}
export declare const FORMAT_MIME: Record<DataLakeFormat, string>;
export declare const FORMAT_EXT: Record<DataLakeFormat, string>;
