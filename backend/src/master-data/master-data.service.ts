import { Injectable, Logger } from '@nestjs/common';
import { MasterDataRepository } from './repository/master-data.repository';
import { HashMapService } from './data-structures/hash-map.service';
import { TrieSearchService } from './data-structures/trie-search.service';
import { GovernmentDataProvider } from './providers/government-data.provider';

@Injectable()
export class MasterDataService {
  private readonly logger = new Logger(MasterDataService.name);

  constructor(
    private readonly repository: MasterDataRepository,
    private readonly hashMapService: HashMapService,
    private readonly trieSearchService: TrieSearchService,
    private readonly governmentProvider: GovernmentDataProvider,
  ) {}

  // ---------------------------------------------------------------------------
  // Master Data Getters (Alphabetical order handled by repository)
  // ---------------------------------------------------------------------------

  async getStates() {
    return this.repository.findStates();
  }

  async getDistricts(stateId?: string) {
    return this.repository.findDistricts(stateId ? { stateId } : {});
  }

  async getTaluks(districtId?: string) {
    return this.repository.findTaluks(districtId ? { districtId } : {});
  }

  async getVillages(talukId?: string) {
    return this.repository.findVillages(talukId ? { talukId } : {});
  }

  async getMandis(districtId?: string) {
    return this.repository.findMandis(districtId ? { districtId } : {});
  }

  async getCommodities() {
    return this.repository.findCommodities();
  }

  async getCropVarieties(commodityId?: string) {
    return this.repository.findCropVarieties(commodityId ? { commodityId } : {});
  }

  async getSeasons() {
    return this.repository.findSeasons();
  }

  async getSoilTypes() {
    return this.repository.findSoilTypes();
  }

  async getIrrigationTypes() {
    return this.repository.findIrrigationTypes();
  }

  async getFertilizers() {
    return this.repository.findFertilizers();
  }

  async getPesticides() {
    return this.repository.findPesticides();
  }

  // ---------------------------------------------------------------------------
  // Search Methods (Trie-based O(m) Autocomplete)
  // ---------------------------------------------------------------------------

  searchCommodities(q: string) {
    return this.trieSearchService.searchCommodities(q);
  }

  searchDistricts(q: string) {
    return this.trieSearchService.searchDistricts(q);
  }

  searchMandis(q: string) {
    return this.trieSearchService.searchMandis(q);
  }

  // ---------------------------------------------------------------------------
  // Data Import
  // ---------------------------------------------------------------------------

  async triggerImport() {
    const result = await this.governmentProvider.importAll();
    if (result.success) {
      // Refresh memory structures after import
      await this.hashMapService.refreshAll();
      await this.trieSearchService.refreshAll();
    }
    return result;
  }

  healthCheck(): { status: string; module: string } {
    this.logger.log('MasterDataService health check called');
    return { status: 'initialising', module: 'master-data' };
  }
}
