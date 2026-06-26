import { Injectable, Logger } from '@nestjs/common';
import { IGeoBoundaryProvider } from './geoboundary-provider.interface';

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
}
