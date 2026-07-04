export declare class RegionalQueryDto {
    level: 'village' | 'taluk' | 'district' | 'state';
    name: string;
}
export declare class AnalyticsQueryDto {
    regionLevel?: string;
    regionName?: string;
    periodType?: string;
    limit?: string;
}
export declare class HistoryQueryDto {
    limit?: string;
}
