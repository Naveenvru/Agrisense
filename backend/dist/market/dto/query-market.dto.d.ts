export declare class QueryMarketDto {
    commodity?: string;
    market?: string;
    district?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
}
export declare class QueryTrendsDto extends QueryMarketDto {
    period?: string;
}
export declare class PriceStatsDto {
    commodity?: string;
    market?: string;
    startDate?: string;
    endDate?: string;
}
