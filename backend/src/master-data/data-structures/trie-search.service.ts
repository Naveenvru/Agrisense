import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MasterDataRepository } from '../repository/master-data.repository';
import { Trie } from './trie';

/**
 * TrieSearchService — Phase 10
 * 
 * Implements a Trie data structure for efficient O(m) prefix searching 
 * (autocomplete support for the frontend).
 * Built on startup and can be refreshed manually.
 */
@Injectable()
export class TrieSearchService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TrieSearchService.name);

  private readonly commodityTrie = new Trie();
  private readonly districtTrie = new Trie();
  private readonly mandiTrie = new Trie();

  constructor(private readonly repository: MasterDataRepository) {}

  async onApplicationBootstrap() {
    await this.refreshAll();
  }

  /**
   * Refreshes all Tries from the database.
   */
  async refreshAll(): Promise<void> {
    this.logger.log('Refreshing Master Data Tries...');

    try {
      const [commodities, districts, mandis] = await Promise.all([
        this.repository.findCommodities(),
        this.repository.findDistricts(),
        this.repository.findMandis(),
      ]);

      this.commodityTrie.clear();
      for (const commodity of commodities) {
        this.commodityTrie.insert(commodity.name, commodity);
      }

      this.districtTrie.clear();
      for (const district of districts) {
        this.districtTrie.insert(district.name, district);
      }

      this.mandiTrie.clear();
      for (const mandi of mandis) {
        this.mandiTrie.insert(mandi.name, mandi);
      }

      this.logger.log(`Tries refreshed: ${commodities.length} Commodities, ${districts.length} Districts, ${mandis.length} Mandis.`);
    } catch (error: any) {
      this.logger.error(`Failed to refresh Tries: ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Search Methods (O(m) complexity where m is prefix length)
  // ---------------------------------------------------------------------------

  searchCommodities(prefix: string): any[] {
    if (!prefix || prefix.trim().length === 0) return [];
    return this.commodityTrie.searchPrefix(prefix.trim());
  }

  searchDistricts(prefix: string): any[] {
    if (!prefix || prefix.trim().length === 0) return [];
    return this.districtTrie.searchPrefix(prefix.trim());
  }

  searchMandis(prefix: string): any[] {
    if (!prefix || prefix.trim().length === 0) return [];
    return this.mandiTrie.searchPrefix(prefix.trim());
  }
}
