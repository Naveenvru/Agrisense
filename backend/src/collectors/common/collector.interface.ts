import { CollectionParams, CollectionResult, CollectorStatus } from './collector.types';

/**
 * ICollector
 *
 * The root interface that every collector in AgriSense must implement.
 *
 * Design rules
 * ─────────────
 * ✔ collect() — calls external provider and returns RAW data
 * ✔ store()   — persists raw data to the Data Lake (Phase 8.7)
 * ✔ status()  — returns operational health of this collector
 *
 * What collectors MUST NOT do
 * ────────────────────────────
 * ✗ Normalize data
 * ✗ Validate data
 * ✗ Run analytics
 * ✗ Run business logic
 * ✗ Transform data into domain models
 *
 * Every collector is a dumb pipe: receive request → call provider → return raw.
 */
export interface ICollector {
  /**
   * Collect raw data from an external provider.
   *
   * @param params  Collection parameters (domain, operation, payload)
   * @returns       A CollectionResult containing the raw provider response and telemetry
   */
  collect(params: CollectionParams): Promise<CollectionResult>;

  /**
   * Persist the raw CollectionResult to the Data Lake.
   * Phase 8.6: console log only.
   * Phase 8.7: writes to MongoDB raw storage.
   *
   * @param result  The CollectionResult produced by collect()
   */
  store(result: CollectionResult): Promise<void>;

  /**
   * Return the operational status of this collector.
   */
  status(): CollectorStatus;
}
