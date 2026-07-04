import { DataSource } from 'typeorm';
import { GeoBoundaryService } from '../../geoboundary/geoboundary.service';
import { HarvestMongoService } from '../../mongodb/harvest/harvest-mongo.service';
import { YieldMongoService } from '../../mongodb/yield/yield-mongo.service';
import { SupplyMongoService } from '../../mongodb/supply/supply-mongo.service';
import type { SupplyRegionalSummary } from '../interfaces/supply-intelligence.types';
import type { SupplyEstimatorStrategy } from '../interfaces/supply-estimator.interface';
export declare class RegionalSupplyService {
    private readonly dataSource;
    private readonly supplyMongoService;
    private readonly harvestMongoService;
    private readonly yieldMongoService;
    private readonly geoBoundaryService;
    private readonly supplyEstimator;
    private readonly logger;
    constructor(dataSource: DataSource, supplyMongoService: SupplyMongoService, harvestMongoService: HarvestMongoService, yieldMongoService: YieldMongoService, geoBoundaryService: GeoBoundaryService, supplyEstimator: SupplyEstimatorStrategy);
    getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<SupplyRegionalSummary>;
    private resolvePrediction;
    private queryActiveFarmerCrops;
    private buildLifecycleContext;
    private resolveRegionHierarchy;
    private matchesRegion;
}
