import { OnApplicationBootstrap } from '@nestjs/common';
import { MarketCollector } from '../collectors/market/market.collector';
import { MarketNormalizationService } from './normalization/market-normalization.service';
import { MarketQualityService } from './quality/market-quality.service';
import { MarketRepository } from './repository/market.repository';
import { MarketAggregationService } from './aggregation/market-aggregation.service';
import { FarmerProfilesService } from '../farmer-profiles/farmer-profiles.service';
import { DataSource } from 'typeorm';
import { MarketCollectParams, IMarketPrice, MarketValidationResult, MarketPriceStats, MarketArrivalStats } from './interfaces/market.interface';
export declare class MarketService implements OnApplicationBootstrap {
    private readonly collector;
    private readonly normalization;
    private readonly quality;
    private readonly repository;
    private readonly aggregation;
    private readonly farmerProfiles;
    private readonly dataSource;
    private readonly logger;
    private cachedFallbackPrices;
    constructor(collector: MarketCollector, normalization: MarketNormalizationService, quality: MarketQualityService, repository: MarketRepository, aggregation: MarketAggregationService, farmerProfiles: FarmerProfilesService, dataSource: DataSource);
    onApplicationBootstrap(): Promise<void>;
    private initFallbackDataset;
    private mapRawToPrice;
    seedAuthenticMarketDataIfEmpty(): Promise<void>;
    findFallbackPrices(commodity?: string, market?: string, startDate?: Date, endDate?: Date, limit?: number, district?: string, state?: string): IMarketPrice[];
    collect(params?: MarketCollectParams): Promise<{
        collectionResult: {
            status: string;
            recordsCollected: number;
            durationMs: number;
        };
        qualityResult: Pick<MarketValidationResult, 'totalInput' | 'totalValid' | 'totalRejected' | 'totalDuplicates'>;
        stored: {
            prices: number;
            arrivals: number;
        };
        dataLake: {
            stored: boolean;
            filename?: string;
        };
    }>;
    getPrices(commodity?: string, market?: string, startDate?: Date, endDate?: Date, limit?: number, district?: string, state?: string): Promise<any[]>;
    getPricesForUser(userId: string, query: {
        commodity?: string;
        market?: string;
        district?: string;
        state?: string;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<any[]>;
    getLatestPrice(commodity: string, market: string): Promise<import("../mongodb/market/market-price.schema").MarketPriceV2 | null>;
    getArrivals(commodity?: string, market?: string, startDate?: Date, endDate?: Date, limit?: number): Promise<import("../mongodb/market/market-arrival.schema").MarketArrival[]>;
    getTrends(commodity?: string, market?: string, period?: string, limit?: number): Promise<import("../mongodb/market/market-trend.schema").MarketTrend[]>;
    getPriceStats(commodity: string, market: string, startDate: Date, endDate: Date): Promise<MarketPriceStats | null>;
    getArrivalTotals(commodity: string, market: string, startDate?: Date, endDate?: Date): Promise<MarketArrivalStats[]>;
    healthCheck(): {
        status: string;
        module: string;
    };
}
