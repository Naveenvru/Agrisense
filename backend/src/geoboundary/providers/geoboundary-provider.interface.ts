import type { GeoJsonFeature } from '../interfaces/geoboundary.interface';

export interface IGeoBoundaryProvider {
  /**
   * Resolves raw coordinates into string-based administrative boundaries.
   * This does NOT resolve IDs.
   */
  reverseGeocode(latitude: number, longitude: number): Promise<{
    villageName?: string;
    talukName?: string;
    districtName?: string;
    stateName?: string;
    countryName?: string;
    postalCode?: string;
    provider: string;
  }>;

  /**
   * Fetches the GeoJSON boundary polygon for a given administrative unit.
   * Used by the polygon lookup endpoint (/geoboundary/polygon).
   *
   * @param adminLevel - The administrative level to look up (e.g. 'district', 'state', 'taluk')
   * @param name       - The name of the administrative unit (e.g. 'Bengaluru Urban')
   * @returns A GeoJSON Feature with the boundary polygon, or null if not found.
   */
  fetchBoundaryPolygon(
    adminLevel: 'village' | 'taluk' | 'district' | 'state' | 'country',
    name: string,
  ): Promise<GeoJsonFeature | null>;
}

export const GEOBOUNDARY_PROVIDER = 'IGeoBoundaryProvider';

