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
}

export const GEOBOUNDARY_PROVIDER = 'IGeoBoundaryProvider';
