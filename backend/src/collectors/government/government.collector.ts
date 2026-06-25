import { Injectable, Logger } from '@nestjs/common';
import { ICollector } from '../common/collector.interface';
import { CollectorLogger } from '../common/collector-logger.service';
import {
  CollectionParams,
  CollectionResult,
  CollectorStatus,
} from '../common/collector.types';
import {
  COLLECTOR_CONSTANTS,
  CollectorDomain,
} from '../common/collector.constants';

/**
 * GovernmentCollector — SKELETON (Future Phase)
 *
 * Will collect data from IMD, ICAR, Soil APIs, government advisories.
 * Skeleton validates the architecture compiles end-to-end.
 */
@Injectable()
export class GovernmentCollector implements ICollector {
  private readonly logger = new Logger(GovernmentCollector.name);

  private totalCollections = 0;
  private successCount = 0;
  private failureCount = 0;

  constructor(private readonly collectorLogger: CollectorLogger) {}

  async collect(_params: CollectionParams): Promise<CollectionResult> {
    this.logger.warn(
      'GovernmentCollector.collect() — not yet implemented (future phase).',
    );
    this.totalCollections++;
    this.failureCount++;

    return {
      domain: COLLECTOR_CONSTANTS.DOMAINS.GOVERNMENT as CollectorDomain,
      operation: COLLECTOR_CONSTANTS.OPERATIONS.GOVERNMENT_ADVISORY,
      provider: 'imd',
      rawData: null,
      status: COLLECTOR_CONSTANTS.STATUS.SKIPPED,
      collectedAt: new Date(),
      durationMs: 0,
      retryCount: 0,
      errorMessage: 'GovernmentCollector not yet implemented.',
    };
  }

  async store(result: CollectionResult): Promise<void> {
    this.collectorLogger.logStore(
      result.provider,
      result.operation,
      'data-lake/raw/government (Phase 8.7)',
    );
  }

  status(): CollectorStatus {
    return {
      domain: COLLECTOR_CONSTANTS.DOMAINS.GOVERNMENT as CollectorDomain,
      operational: false,
      totalCollections: this.totalCollections,
      successCount: this.successCount,
      failureCount: this.failureCount,
    };
  }
}
