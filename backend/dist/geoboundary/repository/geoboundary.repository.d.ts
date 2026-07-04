import { Model } from 'mongoose';
import { GeoBoundaryCache } from '../../mongodb/geoboundary/geoboundary-cache.schema';
import { GeoBoundaryResult, GeoJsonFeature } from '../interfaces/geoboundary.interface';
export declare class GeoBoundaryRepository {
    private readonly cacheModel;
    private readonly logger;
    constructor(cacheModel: Model<GeoBoundaryCache>);
    findByCoordinates(latitude: number, longitude: number): Promise<GeoBoundaryResult | null>;
    save(result: GeoBoundaryResult): Promise<void>;
    findPolygonByAdminUnit(adminLevel: string, name: string): Promise<GeoJsonFeature | null>;
    savePolygon(adminLevel: string, name: string, polygon: GeoJsonFeature): Promise<void>;
}
