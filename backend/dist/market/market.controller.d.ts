import { MarketService } from './market.service';
import { AiMlServiceClient } from '../ai/ai-ml-service.client';
import { CollectMarketDto } from './dto/collect-market.dto';
import { QueryMarketDto, QueryTrendsDto, PriceStatsDto } from './dto/query-market.dto';
export declare class MarketController {
    private readonly marketService;
    private readonly aiMlClient;
    private readonly logger;
    constructor(marketService: MarketService, aiMlClient: AiMlServiceClient);
    health(): {
        status: string;
        module: string;
    };
    collect(dto: CollectMarketDto): Promise<{
        collectionResult: {
            status: string;
            recordsCollected: number;
            durationMs: number;
        };
        qualityResult: Pick<import("./interfaces/market.interface").MarketValidationResult, "totalInput" | "totalValid" | "totalRejected" | "totalDuplicates">;
        stored: {
            prices: number;
            arrivals: number;
        };
        dataLake: {
            stored: boolean;
            filename?: string;
        };
    }>;
    getPrices(query: QueryMarketDto, req: any): Promise<any[]>;
    getLatestPrice(commodity: string, market: string): Promise<import("../mongodb/market/market-price.schema").MarketPriceV2 | null>;
    getForecast(commodity: string, market?: string, state?: string, horizonDays?: number): Promise<import("../ai/ai-ml-service.client").ForecastResponseDto>;
    getArrivals(query: QueryMarketDto): Promise<import("../mongodb/market/market-arrival.schema").MarketArrival[]>;
    getTrends(query: QueryTrendsDto): Promise<import("../mongodb/market/market-trend.schema").MarketTrend[]>;
    getPriceStats(query: PriceStatsDto): Promise<import("./interfaces/market.interface").MarketPriceStats | null>;
    getArrivalTotals(query: PriceStatsDto): Promise<import("./interfaces/market.interface").MarketArrivalStats[]>;
}
