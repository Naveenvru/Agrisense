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
import { MockMarketDataSource } from './mock-market-data.source';
import { DataLakeService } from '../../storage/datalake/datalake.service';
import { STORAGE_CONSTANTS } from '../../storage/common/storage.constants';
import type { MarketFetchParams } from '../../market/interfaces/market.interface';

/**
 * MarketCollector — Phase 9 (activated)
 *
 * Collects raw market price data via an IMarketDataSource implementation.
 * Currently uses MockMarketDataSource; AGMARKNET plugs in without changes.
 *
 * What it does
 * ─────────────
 * ✔ Collects raw market records via IMarketDataSource
 * ✔ Stores raw data to storage/raw/market/ via DataLakeService
 * ✔ Returns CollectionResult with telemetry
 * ✔ Logs every collection via CollectorLogger
 * ✔ Tracks operational stats
 *
 * What it does NOT do
 * ────────────────────
 * ✗ No normalization
 * ✗ No data quality validation
 * ✗ No MongoDB writes (those belong to MarketService)
 * ✗ No business logic
 */
@Injectable()
export class MarketCollector implements ICollector {
  private readonly logger = new Logger(MarketCollector.name);

  private totalCollections = 0;
  private successCount = 0;
  private failureCount = 0;
  private lastSuccessAt?: Date;
  private lastFailureAt?: Date;

  constructor(
    private readonly dataSource: MockMarketDataSource,
    private readonly collectorLogger: CollectorLogger,
    private readonly dataLakeService: DataLakeService,
  ) {}

  // ---------------------------------------------------------------------------
  // ICollector.collect()
  // ---------------------------------------------------------------------------

  async collect(params: CollectionParams): Promise<CollectionResult> {
    const startTime = Date.now();
    const requestedAt = new Date();
    const operation = params.operation ?? COLLECTOR_CONSTANTS.OPERATIONS.MARKET_PRICES;

    this.collectorLogger.logStart(INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET, operation);
    this.logger.log(`Collection started | operation=${operation}`);
    this.totalCollections++;

    try {
      const fetchParams: MarketFetchParams = {
        commodity: params.payload['commodity'] as string | undefined,
        market: params.payload['market'] as string | undefined,
        state: params.payload['state'] as string | undefined,
        district: params.payload['district'] as string | undefined,
        date: params.payload['date'] ? new Date(params.payload['date'] as string) : new Date(),
        limit: (params.payload['limit'] as number | undefined) ?? 50,
      };

      const rawRecords = await this.dataSource.fetchPrices(fetchParams);

      const durationMs = Date.now() - startTime;
      this.successCount++;
      this.lastSuccessAt = new Date();

      const result: CollectionResult = {
        domain: COLLECTOR_CONSTANTS.DOMAINS.MARKET as CollectorDomain,
        operation,
        provider: INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
        rawData: rawRecords,
        status: COLLECTOR_CONSTANTS.STATUS.SUCCESS,
        collectedAt: requestedAt,
        durationMs,
        retryCount: 0,
      };

      this.collectorLogger.logCollection({
        provider: INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
        operation,
        requestedAt,
        respondedAt: new Date(),
        durationMs,
        status: COLLECTOR_CONSTANTS.STATUS.SUCCESS,
        retryCount: 0,
      });

      this.logger.log(
        `Collection completed | records=${rawRecords.length} duration=${durationMs}ms`,
      );

      return result;
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      this.failureCount++;
      this.lastFailureAt = new Date();

      const result: CollectionResult = {
        domain: COLLECTOR_CONSTANTS.DOMAINS.MARKET as CollectorDomain,
        operation,
        provider: INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
        rawData: null,
        status: COLLECTOR_CONSTANTS.STATUS.FAILED,
        collectedAt: requestedAt,
        durationMs,
        retryCount: 0,
        errorMessage: error?.message,
      };

      this.collectorLogger.logCollection({
        provider: INTEGRATION_CONSTANTS.PROVIDERS.AGMARKNET,
        operation,
        requestedAt,
        respondedAt: new Date(),
        durationMs,
        status: COLLECTOR_CONSTANTS.STATUS.FAILED,
        retryCount: 0,
        errorMessage: error?.message,
      });

      this.logger.error(`Collection failed | ${error?.message}`);
      return result;
    }
  }

  // ---------------------------------------------------------------------------
  // ICollector.store() — writes raw dataset to storage/raw/market/
  // ---------------------------------------------------------------------------

  async store(result: CollectionResult): Promise<void> {
    this.collectorLogger.logStore(
      result.provider,
      result.operation,
      'storage/raw/market/',
    );

    if (result.status !== COLLECTOR_CONSTANTS.STATUS.SUCCESS) {
      this.logger.warn(`Skipping store — collection status=${result.status}`);
      return;
    }

    const storageResult = await this.dataLakeService.writeRaw(
      STORAGE_CONSTANTS.DOMAINS.MARKET,
      result,
    );

    if (storageResult.success) {
      this.logger.log(
        `Raw dataset stored | file=${storageResult.location?.filename} size=${storageResult.metadata?.size ?? 0}B`,
      );
    } else {
      this.logger.error(`Raw dataset store failed | ${storageResult.errorMessage}`);
    }
  }

  // ---------------------------------------------------------------------------
  // ICollector.status()
  // ---------------------------------------------------------------------------

  status(): CollectorStatus {
    return {
      domain: COLLECTOR_CONSTANTS.DOMAINS.MARKET as CollectorDomain,
      operational: true,
      lastSuccessAt: this.lastSuccessAt,
      lastFailureAt: this.lastFailureAt,
      totalCollections: this.totalCollections,
      successCount: this.successCount,
      failureCount: this.failureCount,
    };
  }
}
