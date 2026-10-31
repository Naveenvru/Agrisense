import { Injectable, Logger } from '@nestjs/common';
import { IMarketRawRecord, MarketValidationResult } from '../interfaces/market.interface';

/**
 * MarketQualityService — Phase 9
 *
 * Validates raw market records and rejects invalid/duplicate ones.
 *
 * Algorithms used
 * ────────────────
 * ✔ HashSet (Set<string>) — O(1) duplicate detection within a batch
 * ✔ Rule-based validation — required fields, price ranges, date sanity
 *
 * What it does NOT do
 * ────────────────────
 * ✗ No normalization
 * ✗ No persistence
 * ✗ No prediction
 */
@Injectable()
export class MarketQualityService {
  private readonly logger = new Logger(MarketQualityService.name);

  /**
   * Maximum acceptable price in ₹/Quintal.
   * Records above this threshold are flagged as outliers.
   */
  private static readonly MAX_PRICE = 500_000;

  /** Permit retained history while still rejecting implausibly old records. */
  private static readonly MAX_DATE_AGE_DAYS = 3650;

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Validate a batch of raw records.
   *
   * Uses a HashSet to detect duplicates within the current batch.
   * Duplicate detection key: commodity|market|date (YYYY-MM-DD)
   *
   * @param records Raw records from the collector
   * @returns       Partitioned valid and rejected records
   */
  validate(records: IMarketRawRecord[]): MarketValidationResult {
    /**
     * HashSet for in-batch duplicate detection.
     * Key format: "commodity|market|YYYY-MM-DD"
     * O(1) insertion and lookup.
     */
    const seenKeys = new Set<string>();

    const valid: IMarketRawRecord[] = [];
    const rejected: Array<{ record: IMarketRawRecord; reasons: string[] }> = [];
    let duplicateCount = 0;

    for (const record of records) {
      const reasons = this.validateRecord(record);

      if (reasons.length > 0) {
        rejected.push({ record, reasons });
        this.logger.debug(
          `REJECTED | commodity=${record.commodity} market=${record.market} reasons=[${reasons.join(', ')}]`,
        );
        continue;
      }

      // Duplicate detection via HashSet
      const dedupKey = this.dedupKey(record);
      if (seenKeys.has(dedupKey)) {
        duplicateCount++;
        rejected.push({ record, reasons: ['Duplicate record in batch'] });
        this.logger.debug(`DUPLICATE | key=${dedupKey}`);
        continue;
      }

      seenKeys.add(dedupKey);
      valid.push(record);
    }

    this.logger.log(
      `Quality check | total=${records.length} valid=${valid.length} rejected=${rejected.length} duplicates=${duplicateCount}`,
    );

    return {
      valid,
      rejected,
      totalInput: records.length,
      totalValid: valid.length,
      totalRejected: rejected.length,
      totalDuplicates: duplicateCount,
    };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /**
   * Validate a single record.
   * Returns an array of reason strings; empty array = valid.
   */
  private validateRecord(record: IMarketRawRecord): string[] {
    const reasons: string[] = [];

    // --- Required field checks ---
    if (!record.commodity?.trim()) {
      reasons.push('Missing commodity name');
    }
    if (!record.market?.trim()) {
      reasons.push('Missing market name');
    }
    if (!record.date) {
      reasons.push('Missing date');
    }
    if (!record.source?.trim()) {
      reasons.push('Missing source');
    }

    // --- Price validation ---
    if (record.minPrice === undefined || record.minPrice === null) {
      reasons.push('Missing minPrice');
    } else if (record.minPrice < 0) {
      reasons.push(`Invalid minPrice: ${record.minPrice} (negative)`);
    }

    if (record.maxPrice === undefined || record.maxPrice === null) {
      reasons.push('Missing maxPrice');
    } else if (record.maxPrice < 0) {
      reasons.push(`Invalid maxPrice: ${record.maxPrice} (negative)`);
    }

    if (record.modalPrice === undefined || record.modalPrice === null) {
      reasons.push('Missing modalPrice');
    } else if (record.modalPrice < 0) {
      reasons.push(`Invalid modalPrice: ${record.modalPrice} (negative)`);
    }

    // Price consistency: minPrice must not exceed maxPrice
    if (
      record.minPrice >= 0 &&
      record.maxPrice >= 0 &&
      record.minPrice > record.maxPrice
    ) {
      reasons.push(
        `Price range invalid: minPrice (${record.minPrice}) > maxPrice (${record.maxPrice})`,
      );
    }

    // Price outlier check
    if (record.modalPrice > MarketQualityService.MAX_PRICE) {
      reasons.push(
        `modalPrice (${record.modalPrice}) exceeds maximum threshold (${MarketQualityService.MAX_PRICE})`,
      );
    }

    // --- Date validation ---
    if (record.date) {
      const date = new Date(record.date);
      const now = new Date();

      if (isNaN(date.getTime())) {
        reasons.push(`Invalid date format: ${record.date}`);
      } else if (date > now) {
        reasons.push(`Future date not allowed: ${date.toISOString()}`);
      } else {
        const ageDays =
          (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > MarketQualityService.MAX_DATE_AGE_DAYS) {
          reasons.push(
            `Date too old: ${date.toISOString().slice(0, 10)} (>${MarketQualityService.MAX_DATE_AGE_DAYS} days)`,
          );
        }
      }
    }

    // --- Arrival quantity check ---
    if (record.arrivalQty !== undefined && record.arrivalQty < 0) {
      reasons.push(`Invalid arrivalQty: ${record.arrivalQty} (negative)`);
    }

    return reasons;
  }

  /**
   * Compute a location and variety aware HashSet deduplication key.
   */
  private dedupKey(record: IMarketRawRecord): string {
    const dateStr = new Date(record.date).toISOString().slice(0, 10);
    return [record.state, record.district, record.market, record.commodity, record.variety ?? '', record.grade ?? '', dateStr]
      .map((value) => String(value).toLowerCase().trim())
      .join('|');
  }
}
