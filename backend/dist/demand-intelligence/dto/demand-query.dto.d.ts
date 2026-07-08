export declare class RegionalDemandQueryDto {
    level?: 'village' | 'taluk' | 'district' | 'state';
    name?: string;
}
export declare class DemandAnalyticsQueryDto {
    regionLevel?: string;
    regionName?: string;
    periodType?: string;
    limit?: string;
}
export declare class DemandActionQueryDto {
    farmerCropId?: string;
}
