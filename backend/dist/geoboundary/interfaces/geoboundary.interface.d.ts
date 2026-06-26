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
    resolvedAt: Date;
    provider: string;
}
