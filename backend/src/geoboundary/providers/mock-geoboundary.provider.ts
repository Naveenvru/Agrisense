import { Injectable, Logger } from '@nestjs/common';
import { IGeoBoundaryProvider } from './geoboundary-provider.interface';
import type { GeoJsonFeature } from '../interfaces/geoboundary.interface';

/**
 * MockGeoBoundaryProvider
 *
 * Used when no real geocoding API is configured.
 * Returns static data matching Phase 10 mock HashMaps for ID resolution.
 */
@Injectable()
export class MockGeoBoundaryProvider implements IGeoBoundaryProvider {
  private readonly logger = new Logger(MockGeoBoundaryProvider.name);

  async reverseGeocode(latitude: number, longitude: number) {
    this.logger.debug(`Mocking reverse geocode for ${latitude}, ${longitude}`);

    // In a real implementation, this would call Nominatim, Google Maps, etc.
    // Here we'll just return some static mock data that matches our Phase 10 HashMaps.

    return {
      villageName: 'Sample Village',
      talukName: 'Sample Taluk',
      districtName: 'Bengaluru Urban', // Matches Phase 10 mock district
      stateName: 'Karnataka',          // Matches Phase 10 mock state
      countryName: 'India',
      postalCode: '560001',
      provider: 'mock',
    };
  }

  async fetchBoundaryPolygon(
    adminLevel: 'village' | 'taluk' | 'district' | 'state' | 'country',
    name: string,
  ): Promise<GeoJsonFeature | null> {
    this.logger.debug(`Mocking boundary polygon for adminLevel=${adminLevel}, name=${name}`);

    // Returns a mock bounding polygon for Bengaluru Urban district (approximated rectangle).
    // In production, replace with a call to Nominatim /search?q=...&polygon_geojson=1
    // or a spatial database lookup.
    const mockPolygon: GeoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.4600, 12.8340], // SW corner
            [77.7800, 12.8340], // SE corner
            [77.7800, 13.1400], // NE corner
            [77.4600, 13.1400], // NW corner
            [77.4600, 12.8340], // Close ring
          ],
        ],
      },
      properties: {
        adminLevel,
        name,
        source: 'mock',
        note: 'Approximate bounding box — replace with real polygon data in production.',
      },
    };

    return mockPolygon;
  }
}

