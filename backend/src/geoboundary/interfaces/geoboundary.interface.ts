/**
 * Represents a GeoJSON Geometry object.
 * Supports Polygon and MultiPolygon for administrative boundary shapes.
 */
export interface GeoJsonGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

/**
 * Represents a GeoJSON Feature wrapping a geometry with optional properties.
 */
export interface GeoJsonFeature {
  type: 'Feature';
  geometry: GeoJsonGeometry;
  properties?: Record<string, any>;
}

export interface GeoBoundaryResult {
  latitude: number;
  longitude: number;

  // Raw Strings returned by the provider
  villageName?: string;
  talukName?: string;
  districtName?: string;
  stateName?: string;
  countryName?: string;
  postalCode?: string;

  // Resolved Master Data IDs (if matched via HashMapService)
  villageId?: string;
  talukId?: string;
  districtId?: string;
  stateId?: string;

  /**
   * Optional GeoJSON boundary polygon for the resolved administrative unit.
   * Populated only when fetched via the polygon lookup endpoint.
   */
  boundaryPolygon?: GeoJsonFeature;

  resolvedAt: Date;
  provider: string; // e.g., 'mock', 'nominatim'
}

