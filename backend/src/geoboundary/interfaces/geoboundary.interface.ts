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

  resolvedAt: Date;
  provider: string; // e.g., 'mock', 'nominatim'
}
