import { MasterDataRepository } from './repository/master-data.repository';
import { HashMapService } from './data-structures/hash-map.service';
import { TrieSearchService } from './data-structures/trie-search.service';
import { GovernmentDataProvider } from './providers/government-data.provider';
export declare class MasterDataService {
    private readonly repository;
    private readonly hashMapService;
    private readonly trieSearchService;
    private readonly governmentProvider;
    private readonly logger;
    constructor(repository: MasterDataRepository, hashMapService: HashMapService, trieSearchService: TrieSearchService, governmentProvider: GovernmentDataProvider);
    getStates(): Promise<import("../mongodb/master-data/master-data.schema").State[]>;
    getDistricts(stateId?: string): Promise<import("../mongodb/master-data/master-data.schema").District[]>;
    getTaluks(districtId?: string): Promise<import("../mongodb/master-data/master-data.schema").Taluk[]>;
    getVillages(talukId?: string): Promise<import("../mongodb/master-data/master-data.schema").Village[]>;
    getMandis(districtId?: string): Promise<import("../mongodb/master-data/master-data.schema").Mandi[]>;
    getCommodities(): Promise<import("../mongodb/master-data/master-data.schema").Commodity[]>;
    getCropVarieties(commodityId?: string): Promise<import("../mongodb/master-data/master-data.schema").CropVariety[]>;
    getSeasons(): Promise<import("../mongodb/master-data/master-data.schema").Season[]>;
    getSoilTypes(): Promise<import("../mongodb/master-data/master-data.schema").SoilType[]>;
    getIrrigationTypes(): Promise<import("../mongodb/master-data/master-data.schema").IrrigationType[]>;
    getFertilizers(): Promise<import("../mongodb/master-data/master-data.schema").Fertilizer[]>;
    getPesticides(): Promise<import("../mongodb/master-data/master-data.schema").Pesticide[]>;
    searchCommodities(q: string): any[];
    searchDistricts(q: string): any[];
    searchMandis(q: string): any[];
    triggerImport(): Promise<{
        success: boolean;
        message: string;
    }>;
    healthCheck(): {
        status: string;
        module: string;
    };
}
