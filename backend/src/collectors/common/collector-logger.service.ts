import { Injectable, Logger } from '@nestjs/common';
import { CollectionTelemetry } from './collector.types';

/**
 * CollectorLogger
 *
 * Structured, reusable logging service for the collector layer.
 * Every collection emits consistent telemetry to the console.
 *
 * Fields logged per collection
 * ─────────────────────────────
 * ✔ Provider name
 * ✔ Operation
 * ✔ Request time (UTC)
 * ✔ Response time (UTC)
 * ✔ Duration in ms
 * ✔ Status (success / failed / partial)
 * ✔ Retry count
 * ✔ Error message on failure
 *
 * Phase 8.7: this will write structured JSON to a Data Lake log store.
 */
@Injectable()
export class CollectorLogger {
  private readonly logger = new Logger('CollectorLayer');

  /**
   * Log a completed collection event.
   */
  logCollection(telemetry: CollectionTelemetry): void {
    const base = `[${telemetry.provider}] ${telemetry.operation}`;
    const timing = `${telemetry.durationMs}ms`;
    const retries = telemetry.retryCount > 0 ? ` | retries=${telemetry.retryCount}` : '';

    if (telemetry.status === 'success') {
      this.logger.log(
        `${base} ✓ SUCCESS (${timing})${retries}`,
      );
    } else if (telemetry.status === 'failed') {
      this.logger.error(
        `${base} ✗ FAILED (${timing})${retries} | error=${telemetry.errorMessage}`,
      );
    } else {
      this.logger.warn(
        `${base} ⚠ ${telemetry.status.toUpperCase()} (${timing})${retries}`,
      );
    }
  }

  /**
   * Log the start of a collection (before the provider call).
   */
  logStart(provider: string, operation: string): void {
    this.logger.debug(`[${provider}] → Starting collection: ${operation}`);
  }

  /**
   * Log a store operation (Data Lake write).
   */
  logStore(provider: string, operation: string, destination: string): void {
    this.logger.debug(
      `[${provider}] ↓ Storing raw result | operation=${operation} destination=${destination}`,
    );
  }
}
