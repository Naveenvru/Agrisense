import { MarketRepository } from '../repository/market.repository';
import { MarketPriceStats, MarketArrivalStats } from '../interfaces/market.interface';
export declare class MarketAggregationService {
    private readonly repository;
    private readonly logger;
    constructor(repository: MarketRepository);
    priceStats(commodity: string, market: string, startDate: Date, endDate: Date): Promise<MarketPriceStats | null>;
    arrivalTotals(commodity: string, market: string, startDate?: Date, endDate?: Date): Promise<MarketArrivalStats[]>;
}
