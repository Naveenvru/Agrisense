import { DataSource } from 'typeorm';
import { HarvestMongoService } from '../../mongodb/harvest/harvest-mongo.service';
export declare class RegionalHarvestService {
    private readonly dataSource;
    private readonly harvestMongoService;
    private readonly logger;
    constructor(dataSource: DataSource, harvestMongoService: HarvestMongoService);
    getRegionalSummary(regionLevel: 'village' | 'taluk' | 'district' | 'state', regionName: string): Promise<{
        regionLevel: "district" | "state" | "village" | "taluk";
        regionName: string;
        totalFarmers: number;
        totalCrops: number;
        summary: string;
        crops: never[];
        totalAssessed?: undefined;
        avgReadinessScore?: undefined;
        totalExpectedYieldKg?: undefined;
        readyCrops?: undefined;
        delayedCrops?: undefined;
        cropBreakdown?: undefined;
        generatedAt?: undefined;
    } | {
        regionLevel: "district" | "state" | "village" | "taluk";
        regionName: string;
        totalFarmers: number;
        totalCrops: number;
        totalAssessed: number;
        avgReadinessScore: number;
        totalExpectedYieldKg: number;
        readyCrops: number;
        delayedCrops: number;
        cropBreakdown: Record<string, {
            count: number;
            totalYieldKg: number;
            avgReadiness: number;
        }>;
        generatedAt: Date;
        summary?: undefined;
        crops?: undefined;
    }>;
    saveRegionalAnalytics(regionLevel: string, regionName: string, periodType: 'weekly' | 'monthly', data: Record<string, any>): Promise<void>;
    private queryFarmerCropsByRegion;
}
