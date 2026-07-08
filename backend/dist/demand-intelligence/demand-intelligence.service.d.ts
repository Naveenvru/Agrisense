import { DataSource } from 'typeorm';
import { WeatherService } from '../weather/weather.service';
import { GeoBoundaryService } from '../geoboundary/geoboundary.service';
import { HarvestMongoService } from '../mongodb/harvest/harvest-mongo.service';
import { YieldMongoService } from '../mongodb/yield/yield-mongo.service';
import { SupplyMongoService } from '../mongodb/supply/supply-mongo.service';
import { DemandMongoService } from '../mongodb/demand/demand-mongo.service';
import { MarketRepository } from '../market/repository/market.repository';
import type { DemandEstimatorStrategy } from './interfaces/demand-estimator.interface';
import type { DemandAggregator } from './interfaces/demand-aggregator.interface';
import type { DemandPredictionResult } from './interfaces/demand-intelligence.types';
import { DemandEventPublisher } from './events/demand-event.publisher';
import { DemandAnalyticsService } from './services/demand-analytics.service';
export interface DemandIntelligenceServiceInterface {
    runBulkAssessment(userId?: string): Promise<{
        assessed: number;
        failed: number;
    }>;
}
export declare class DemandIntelligenceService implements DemandIntelligenceServiceInterface {
    private readonly dataSource;
    private readonly weatherService;
    private readonly geoBoundaryService;
    private readonly harvestMongoService;
    private readonly yieldMongoService;
    private readonly supplyMongoService;
    private readonly demandMongoService;
    private readonly marketRepository;
    private readonly eventPublisher;
    private readonly regionalService;
    private readonly analyticsService;
    private readonly demandEstimator;
    private readonly logger;
    constructor(dataSource: DataSource, weatherService: WeatherService, geoBoundaryService: GeoBoundaryService, harvestMongoService: HarvestMongoService, yieldMongoService: YieldMongoService, supplyMongoService: SupplyMongoService, demandMongoService: DemandMongoService, marketRepository: MarketRepository, eventPublisher: DemandEventPublisher, regionalService: DemandAggregator, analyticsService: DemandAnalyticsService, demandEstimator: DemandEstimatorStrategy);
    assess(farmerCropId: string, userId: string): Promise<DemandPredictionResult>;
    getAssessment(farmerCropId: string, userId: string): Promise<DemandPredictionResult>;
    getMyAssessments(userId: string): Promise<any[]>;
    getSummary(userId: string): Promise<any[]>;
    getRisk(farmerCropId?: string, userId?: string): Promise<{
        farmerCropId: string;
        cropName: string;
        riskLevel: any;
        riskScore: any;
        reasons: any;
        mitigationRecommendations: any;
        explanations: string[];
        totalAssessments?: undefined;
    } | {
        riskLevel: any;
        riskScore: any;
        reasons: any;
        mitigationRecommendations: any;
        explanations: any;
        totalAssessments: number;
        farmerCropId?: undefined;
        cropName?: undefined;
    }>;
    getTimeline(farmerCropId?: string, userId?: string): Promise<any>;
    getRegional(level: string, name: string): Promise<import("./interfaces/demand-intelligence.types").DemandRegionalSummary>;
    getAnalytics(regionLevel?: string, regionName?: string, periodType?: string, limit?: number): Promise<any[]>;
    refreshAnalytics(): Promise<import("./interfaces/demand-intelligence.types").DemandAnalyticsSnapshot>;
    runBulkAssessment(userId?: string): Promise<{
        assessed: number;
        failed: number;
    }>;
    private loadAssessmentContext;
    private buildMarketContext;
    private buildLifecycleContext;
    private buildWeatherContext;
    private resolveRegionHierarchy;
    private loadCropData;
    private loadActiveRows;
    private loadHistoricalDemand;
    private resolveProfileId;
}
