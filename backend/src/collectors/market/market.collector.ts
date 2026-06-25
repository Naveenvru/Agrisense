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
import { INTEGRATION_CONSTANTS } from '../../integrations/common/integration.constants';

/**
 * MarketCollector — SKELETON (Phase 9)
 *
 * Will collect raw market price data from AGMARKNET / eNAM.
 * Skeleton is here now to validate the architecture and DI graph.
 *
 * When Phase 9 arrives:
 *   1. Inject AgmarknetClient (already stubbed in integrations/market)
 *   2. Implement collect() with real API calls
 *   3. No changes to CollectorModule or CollectorLogger needed
 */
@Injectable()
export class MarketCollector implements ICollector {
  private readonly logger = new Logger(MarketCollector.name);

  private totalCollections = 0;
  private successCount = 0;
  private failureCount = 0;

  constructor(private readonly collectorLogger: CollectorLogger) {}

  async collect(_params: CollectionParams): Promise<CollectionResult> {
    this.logger.warn(
      'MarketCollector.collect() — not yet implemented (Phase 9).',
    );
    this.totalCollections++;
    this.failureCount++;

    return {
      domain: COLLECTOR_CONSTANTS.DOMAINS.MARKET as CollectorDomain,
      operation: COLLECTOR_CONSTANTS.OPERATIONS.MARKET_PRICES,
      provider: INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
      rawData: null,
      status: COLLECTOR_CONSTANTS.STATUS.SKIPPED,
      collectedAt: new Date(),
      durationMs: 0,
      retryCount: 0,
      errorMessage: 'MarketCollector not yet implemented (Phase 9).',
    };
  }

  async store(result: CollectionResult): Promise<void> {
    this.collectorLogger.logStore(
      result.provider,
      result.operation,
      'data-lake/raw/market (Phase 8.7)',
    );
  }

  status(): CollectorStatus {
    return {
      domain: COLLECTOR_CONSTANTS.DOMAINS.MARKET as CollectorDomain,
      operational: false,
      totalCollections: this.totalCollections,
      successCount: this.successCount,
      failureCount: this.failureCount,
    };
  }
}
