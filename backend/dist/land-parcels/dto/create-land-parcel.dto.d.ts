export declare class CreateLandParcelDto {
    parcelName?: string;
    areaAcres?: number;
    soilType?: string;
    landType?: string;
    irrigationType?: string;
    latitude?: number;
    longitude?: number;
    additionalMetadata?: Record<string, any>;
    boundaryGeoJson?: {
        type: string;
        coordinates: unknown[];
    };
    village?: string;
    taluk?: string;
    district?: string;
    state?: string;
    pinCode?: string;
    description?: string;
    landProfile?: Record<string, any>;
    locationAccuracy?: 'boundary' | 'gps' | 'approximate';
}
