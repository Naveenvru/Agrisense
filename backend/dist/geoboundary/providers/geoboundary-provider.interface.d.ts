import type { GeoJsonFeature } from '../interfaces/geoboundary.interface';
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
    fetchBoundaryPolygon(adminLevel: 'village' | 'taluk' | 'district' | 'state' | 'country', name: string): Promise<GeoJsonFeature | null>;
}
export declare const GEOBOUNDARY_PROVIDER = "IGeoBoundaryProvider";
