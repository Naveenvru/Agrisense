import { DataSource } from 'typeorm';
import { GeoBoundaryService } from '../../geoboundary/geoboundary.service';
import { YieldMongoService } from '../../mongodb/yield/yield-mongo.service';
import type { YieldRegionalSummary } from '../interfaces/yield-intelligence.types';
export declare class RegionalYieldService {
    private readonly dataSource;
    private readonly yieldMongoService;
    private readonly geoBoundaryService;
    private readonly logger;
    constructor(dataSource: DataSource, yieldMongoService: YieldMongoService, geoBoundaryService: GeoBoundaryService);
    getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<YieldRegionalSummary>;
    private queryFarmerCropsByRegion;
}
