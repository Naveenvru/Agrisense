import { CollectionTelemetry } from './collector.types';
export declare class CollectorLogger {
    private readonly logger;
    logCollection(telemetry: CollectionTelemetry): void;
    logStart(provider: string, operation: string): void;
    logStore(provider: string, operation: string, destination: string): void;
}
