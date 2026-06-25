import { CollectorDomain, CollectorOperation, CollectionStatus } from './collector.constants';
export interface CollectionParams {
    domain: CollectorDomain;
    operation: CollectorOperation;
    payload: Record<string, unknown>;
    requestedAt: Date;
}
export interface CollectionResult<T = unknown> {
    domain: CollectorDomain;
    operation: CollectorOperation;
    provider: string;
    rawData: T;
    status: CollectionStatus;
    collectedAt: Date;
    durationMs: number;
    retryCount: number;
    errorMessage?: string;
}
export interface CollectorStatus {
    domain: CollectorDomain;
    operational: boolean;
    lastSuccessAt?: Date;
    lastFailureAt?: Date;
    totalCollections: number;
    successCount: number;
    failureCount: number;
}
export interface CollectionTelemetry {
    provider: string;
    operation: string;
    requestedAt: Date;
    respondedAt: Date;
    durationMs: number;
    status: CollectionStatus;
    retryCount: number;
    errorMessage?: string;
}
