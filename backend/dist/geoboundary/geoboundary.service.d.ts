import { GeoBoundaryResult, GeoJsonFeature } from './interfaces/geoboundary.interface';
import { GeoBoundaryRepository } from './repository/geoboundary.repository';
import type { IGeoBoundaryProvider } from './providers/geoboundary-provider.interface';
import { HashMapService } from '../master-data/data-structures/hash-map.service';
export declare class GeoBoundaryService {
    private readonly repository;
    private readonly provider;
    private readonly hashMapService;
    private readonly logger;
    private readonly coordinateCache;
    private readonly polygonCache;
    constructor(repository: GeoBoundaryRepository, provider: IGeoBoundaryProvider, hashMapService: HashMapService);
    resolveLocation(latitude: number, longitude: number): Promise<GeoBoundaryResult>;
    resolveBoundaryPolygon(adminLevel: 'village' | 'taluk' | 'district' | 'state' | 'country', name: string): Promise<GeoJsonFeature>;
    healthCheck(): {
        status: string;
        module: string;
    };
}
