import { DataSource } from 'typeorm';
import { GeoBoundaryService } from '../../geoboundary/geoboundary.service';
import { HarvestMongoService } from '../../mongodb/harvest/harvest-mongo.service';
import { YieldMongoService } from '../../mongodb/yield/yield-mongo.service';
import { SupplyMongoService } from '../../mongodb/supply/supply-mongo.service';
import { DemandMongoService } from '../../mongodb/demand/demand-mongo.service';
import type { DemandRegionalSummary } from '../interfaces/demand-intelligence.types';
import type { DemandAggregator } from '../interfaces/demand-aggregator.interface';
import type { DemandEstimatorStrategy } from '../interfaces/demand-estimator.interface';
export declare class RegionalDemandService implements DemandAggregator {
    private readonly dataSource;
    private readonly demandMongoService;
    private readonly harvestMongoService;
    private readonly yieldMongoService;
    private readonly supplyMongoService;
    private readonly geoBoundaryService;
    private readonly demandEstimator;
    private readonly logger;
    constructor(dataSource: DataSource, demandMongoService: DemandMongoService, harvestMongoService: HarvestMongoService, yieldMongoService: YieldMongoService, supplyMongoService: SupplyMongoService, geoBoundaryService: GeoBoundaryService, demandEstimator: DemandEstimatorStrategy);
    getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<DemandRegionalSummary>;
    private resolvePrediction;
    private queryActiveFarmerCrops;
    private buildLifecycleContext;
    private resolveRegionHierarchy;
    private matchesRegion;
}
