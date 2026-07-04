import type { GeoBoundaryResult, GeoJsonFeature } from './geoboundary.interface';
export declare const REDIS_BOUNDARY_CACHE = "IRedisBoundaryCache";
export interface IRedisBoundaryCache {
    getByCoordinates(latitude: number, longitude: number): Promise<GeoBoundaryResult | null>;
    setByCoordinates(result: GeoBoundaryResult, ttlSec?: number): Promise<void>;
    getBoundaryPolygon(adminLevel: string, name: string): Promise<GeoJsonFeature | null>;
    setBoundaryPolygon(adminLevel: string, name: string, polygon: GeoJsonFeature, ttlSec?: number): Promise<void>;
    geoAdd(indexKey: string, memberId: string, latitude: number, longitude: number): Promise<void>;
    geoSearch(indexKey: string, latitude: number, longitude: number, radiusMeters: number): Promise<string[]>;
    geoDistance(indexKey: string, memberId1: string, memberId2: string): Promise<number | null>;
    del(key: string): Promise<void>;
    flushGeoKeys(): Promise<void>;
}
