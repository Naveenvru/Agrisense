import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MasterDataRepository } from '../repository/master-data.repository';

/**
 * HashMapService — Phase 10
 * 
 * Provides O(1) in-memory lookups for frequently accessed master data.
 * Built on startup and can be refreshed manually.
 */
@Injectable()
export class HashMapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(HashMapService.name);

  // HashMaps: Name -> ID
  private readonly stateMap = new Map<string, string>();
  private readonly districtMap = new Map<string, string>();
  private readonly commodityMap = new Map<string, string>();
  private readonly mandiMap = new Map<string, string>();

  // HashMaps: ID -> Entity
  private readonly stateIdMap = new Map<string, any>();
  private readonly districtIdMap = new Map<string, any>();
  private readonly commodityIdMap = new Map<string, any>();
  private readonly mandiIdMap = new Map<string, any>();

  constructor(private readonly repository: MasterDataRepository) {}

  async onApplicationBootstrap() {
    await this.refreshAll();
  }

  /**
   * Refreshes all in-memory HashMaps from the database.
   */
  async refreshAll(): Promise<void> {
    this.logger.log('Refreshing Master Data HashMaps...');

    try {
      const [states, districts, commodities, mandis] = await Promise.all([
        this.repository.findStates(),
        this.repository.findDistricts(),
        this.repository.findCommodities(),
        this.repository.findMandis(),
      ]);

      this.stateMap.clear();
      this.stateIdMap.clear();
      for (const state of states) {
        const idStr = state._id.toString();
        this.stateMap.set(state.name.toLowerCase(), idStr);
        this.stateIdMap.set(idStr, state);
      }

      this.districtMap.clear();
      this.districtIdMap.clear();
      for (const district of districts) {
        const idStr = district._id.toString();
        this.districtMap.set(district.name.toLowerCase(), idStr);
        this.districtIdMap.set(idStr, district);
      }

      this.commodityMap.clear();
      this.commodityIdMap.clear();
      for (const commodity of commodities) {
        const idStr = commodity._id.toString();
        this.commodityMap.set(commodity.name.toLowerCase(), idStr);
        this.commodityIdMap.set(idStr, commodity);
      }

      this.mandiMap.clear();
      this.mandiIdMap.clear();
      for (const mandi of mandis) {
        const idStr = mandi._id.toString();
        this.mandiMap.set(mandi.name.toLowerCase(), idStr);
        this.mandiIdMap.set(idStr, mandi);
      }

      this.logger.log(`HashMaps refreshed: ${this.stateMap.size} States, ${this.districtMap.size} Districts, ${this.commodityMap.size} Commodities, ${this.mandiMap.size} Mandis.`);
    } catch (error: any) {
      this.logger.error(`Failed to refresh HashMaps: ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Lookup Methods (O(1) complexity)
  // ---------------------------------------------------------------------------

  getStateId(name: string): string | undefined {
    return this.stateMap.get(name.toLowerCase());
  }

  getStateById(id: string): any {
    return this.stateIdMap.get(id);
  }

  getDistrictId(name: string): string | undefined {
    return this.districtMap.get(name.toLowerCase());
  }

  getDistrictById(id: string): any {
    return this.districtIdMap.get(id);
  }

  getCommodityId(name: string): string | undefined {
    return this.commodityMap.get(name.toLowerCase());
  }

  getCommodityById(id: string): any {
    return this.commodityIdMap.get(id);
  }

  getMandiId(name: string): string | undefined {
    return this.mandiMap.get(name.toLowerCase());
  }

  getMandiById(id: string): any {
    return this.mandiIdMap.get(id);
  }
}
