import { OnApplicationBootstrap } from '@nestjs/common';
import { MasterDataRepository } from '../repository/master-data.repository';
export declare class TrieSearchService implements OnApplicationBootstrap {
    private readonly repository;
    private readonly logger;
    private readonly commodityTrie;
    private readonly districtTrie;
    private readonly mandiTrie;
    constructor(repository: MasterDataRepository);
    onApplicationBootstrap(): Promise<void>;
    refreshAll(): Promise<void>;
    searchCommodities(prefix: string): any[];
    searchDistricts(prefix: string): any[];
    searchMandis(prefix: string): any[];
}
