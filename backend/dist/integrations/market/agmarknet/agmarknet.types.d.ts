export interface AgmarknetPriceRecord {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: number;
    max_price: number;
    modal_price: number;
}
export interface AgmarknetApiResponse {
    records: AgmarknetPriceRecord[];
    total: number;
}
