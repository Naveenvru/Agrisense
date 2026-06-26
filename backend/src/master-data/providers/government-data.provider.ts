import { Injectable, Logger } from '@nestjs/common';
import { MasterDataRepository } from '../repository/master-data.repository';
import { DataLakeService } from '../../storage/datalake/datalake.service';
import { STORAGE_CONSTANTS } from '../../storage/common/storage.constants';
import { COLLECTOR_CONSTANTS } from '../../collectors/common/collector.constants';

/**
 * GovernmentDataProvider
 * 
 * Responsible for loading static/API JSON datasets,
 * storing them raw in the Data Lake, and then passing
 * them to the MasterDataRepository.
 */
@Injectable()
export class GovernmentDataProvider {
  private readonly logger = new Logger(GovernmentDataProvider.name);

  // Mock static data for initial import
  private readonly mockData = {
    states: [
      { name: 'Karnataka', code: 'KA' },
      { name: 'Maharashtra', code: 'MH' },
      { name: 'Gujarat', code: 'GJ' },
    ],
    districts: [
      { name: 'Bengaluru Urban', stateId: 'Karnataka' },
      { name: 'Nashik', stateId: 'Maharashtra' },
      { name: 'Ahmedabad', stateId: 'Gujarat' },
    ],
    commodities: [
      { name: 'Rice', category: 'Cereals' },
      { name: 'Wheat', category: 'Cereals' },
      { name: 'Tomato', category: 'Vegetables' },
      { name: 'Onion', category: 'Vegetables' },
    ],
    mandis: [
      { name: 'Bengaluru APMC', districtId: 'Bengaluru Urban' },
      { name: 'Nashik APMC', districtId: 'Nashik' },
      { name: 'Azadpur Mandi', districtId: 'New Delhi' },
    ],
    soilTypes: [
      { name: 'Alluvial Soil', description: 'Very fertile' },
      { name: 'Black Soil', description: 'Good for cotton' },
      { name: 'Red Soil', description: 'Rich in iron' },
    ]
  };

  constructor(
    private readonly repository: MasterDataRepository,
    private readonly dataLakeService: DataLakeService,
  ) {}

  /**
   * Imports all master data sets.
   * 1. Fetch data (mocked currently)
   * 2. Store in Data Lake (storage/raw/government/)
   * 3. Upsert to MongoDB via repository
   */
  async importAll(): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('Starting master data import from GovernmentDataProvider...');

      // 1. Fetch data (In real implementation, this would be HTTP calls)
      const data = this.mockData;

      // 2. Store raw payload to Data Lake
      const collectionResult = {
        domain: COLLECTOR_CONSTANTS.DOMAINS.GOVERNMENT,
        operation: 'master_data_import' as any,
        provider: 'government_mock_api',
        rawData: data,
        status: COLLECTOR_CONSTANTS.STATUS.SUCCESS,
        collectedAt: new Date(),
        durationMs: 0,
        retryCount: 0,
      };

      const storageResult = await this.dataLakeService.writeRaw(
        STORAGE_CONSTANTS.DOMAINS.GOVERNMENT,
        collectionResult,
      );

      if (storageResult.success) {
        this.logger.log(`Raw master data stored | file=${storageResult.location?.filename}`);
      } else {
        this.logger.error(`Failed to store raw master data | ${storageResult.errorMessage}`);
      }

      // 3. Upsert into MongoDB
      await this.repository.upsertStates(data.states);
      await this.repository.upsertDistricts(data.districts);
      await this.repository.upsertCommodities(data.commodities);
      await this.repository.upsertMandis(data.mandis);
      await this.repository.upsertSoilTypes(data.soilTypes);

      this.logger.log('Master data import complete');

      return { success: true, message: 'Master data imported successfully' };
    } catch (error: any) {
      this.logger.error(`Error during master data import: ${error.message}`);
      return { success: false, message: error.message };
    }
  }
}
