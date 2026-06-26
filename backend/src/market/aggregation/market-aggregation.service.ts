import { Injectable, Logger } from '@nestjs/common';
import { MarketRepository } from '../repository/market.repository';
import { MarketPriceStats, MarketArrivalStats } from '../interfaces/market.interface';

/**
 * MarketAggregationService — Phase 9
 *
 * Runs MongoDB aggregation pipelines for market analytics.
 *
 * Pipelines implemented
 * ─────────────────────
 * ✔ priceStats()    — avg / min / max price for a commodity+market+date range
 * ✔ arrivalTotals() — total arrivals grouped by date for a commodity+market
 *
 * What it does NOT do
 * ────────────────────
 * ✗ No forecasting or prediction
 * ✗ No normalization
 * ✗ No persistence
 */
@Injectable()
export class MarketAggregationService {
  private readonly logger = new Logger(MarketAggregationService.name);

  constructor(private readonly repository: MarketRepository) {}

  // ---------------------------------------------------------------------------
  // Price Statistics
  // ---------------------------------------------------------------------------

  /**
   * Compute average, minimum, and maximum modalPrice for a given
   * commodity and market over a date range.
   *
   * MongoDB pipeline:
   *   $match → filter by commodity, market, date range
   *   $group → compute $avg, $min, $max on modalPrice / minPrice / maxPrice
   *   $project → shape the output
   */
  async priceStats(
    commodity: string,
    market: string,
    startDate: Date,
    endDate: Date,
  ): Promise<MarketPriceStats | null> {
    this.logger.debug(
      `priceStats | commodity=${commodity} market=${market} ${startDate.toISOString().slice(0, 10)}→${endDate.toISOString().slice(0, 10)}`,
    );

    const priceModel = this.repository.getPriceModel();

    const pipeline = [
      {
        $match: {
          commodity: new RegExp(commodity, 'i'),
          market: new RegExp(market, 'i'),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$modalPrice' },
          minPrice: { $min: '$minPrice' },
          maxPrice: { $max: '$maxPrice' },
          recordCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          recordCount: 1,
        },
      },
    ];

    const results = await priceModel.aggregate(pipeline).exec();

    if (!results.length) {
      this.logger.debug(`priceStats | no records found`);
      return null;
    }

    const r = results[0];
    return {
      commodity,
      market,
      startDate,
      endDate,
      avgPrice: r.avgPrice ?? 0,
      minPrice: r.minPrice ?? 0,
      maxPrice: r.maxPrice ?? 0,
      recordCount: r.recordCount ?? 0,
    };
  }

  // ---------------------------------------------------------------------------
  // Arrival Totals
  // ---------------------------------------------------------------------------

  /**
   * Compute total arrival quantities grouped by date for a commodity+market.
   *
   * MongoDB pipeline:
   *   $match → filter by commodity, market, optional date range
   *   $group → sum arrivalQty per date
   *   $sort  → chronological order
   *   $project → shape the output
   */
  async arrivalTotals(
    commodity: string,
    market: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<MarketArrivalStats[]> {
    this.logger.debug(`arrivalTotals | commodity=${commodity} market=${market}`);

    const arrivalModel = this.repository.getArrivalModel();

    const matchStage: Record<string, any> = {
      commodity: new RegExp(commodity, 'i'),
      market: new RegExp(market, 'i'),
    };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = startDate;
      if (endDate) matchStage.date.$lte = endDate;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
            unit: '$unit',
          },
          totalArrival: { $sum: '$arrivalQty' },
        },
      },
      { $sort: { '_id.date': 1 as const } },
      {
        $project: {
          _id: 0,
          date: '$_id.date',
          unit: '$_id.unit',
          totalArrival: 1,
        },
      },
    ] as any[];

    const results = await arrivalModel.aggregate(pipeline).exec();

    return results.map((r: any) => ({
      commodity,
      market,
      date: new Date(r.date),
      totalArrival: r.totalArrival ?? 0,
      unit: r.unit ?? 'Quintal',
    }));
  }
}
