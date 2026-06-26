export interface IGeoBoundaryProvider {
    reverseGeocode(latitude: number, longitude: number): Promise<{
        villageName?: string;
        talukName?: string;
        districtName?: string;
        stateName?: string;
        countryName?: string;
        postalCode?: string;
        provider: string;
    }>;
}
export declare const GEOBOUNDARY_PROVIDER = "IGeoBoundaryProvider";
