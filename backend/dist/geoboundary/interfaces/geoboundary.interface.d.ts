export interface GeoJsonGeometry {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
}
export interface GeoJsonFeature {
    type: 'Feature';
    geometry: GeoJsonGeometry;
    properties?: Record<string, any>;
}
export interface GeoBoundaryResult {
    latitude: number;
    longitude: number;
    villageName?: string;
    talukName?: string;
    districtName?: string;
    stateName?: string;
    countryName?: string;
    postalCode?: string;
    villageId?: string;
    talukId?: string;
    districtId?: string;
    stateId?: string;
    boundaryPolygon?: GeoJsonFeature;
    resolvedAt: Date;
    provider: string;
}
