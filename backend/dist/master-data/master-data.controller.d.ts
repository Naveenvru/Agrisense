import { SearchQueryDto, DistrictQueryDto, TalukQueryDto, VillageQueryDto, MandiQueryDto, CropVarietyQueryDto } from './dto/master-data.dto';
import { MasterDataService } from './master-data.service';
export declare class MasterDataController {
    private readonly masterDataService;
    private readonly logger;
    constructor(masterDataService: MasterDataService);
    health(): {
        status: string;
        module: string;
    };
    getStates(): Promise<import("../mongodb/master-data/master-data.schema").State[]>;
    getDistricts(query: DistrictQueryDto): Promise<import("../mongodb/master-data/master-data.schema").District[]>;
    getTaluks(query: TalukQueryDto): Promise<import("../mongodb/master-data/master-data.schema").Taluk[]>;
    getVillages(query: VillageQueryDto): Promise<import("../mongodb/master-data/master-data.schema").Village[]>;
    getMandis(query: MandiQueryDto): Promise<import("../mongodb/master-data/master-data.schema").Mandi[]>;
    getCommodities(): Promise<import("../mongodb/master-data/master-data.schema").Commodity[]>;
    getCropVarieties(query: CropVarietyQueryDto): Promise<import("../mongodb/master-data/master-data.schema").CropVariety[]>;
    getSeasons(): Promise<import("../mongodb/master-data/master-data.schema").Season[]>;
    getSoilTypes(): Promise<import("../mongodb/master-data/master-data.schema").SoilType[]>;
    getIrrigationTypes(): Promise<import("../mongodb/master-data/master-data.schema").IrrigationType[]>;
    getFertilizers(): Promise<import("../mongodb/master-data/master-data.schema").Fertilizer[]>;
    getPesticides(): Promise<import("../mongodb/master-data/master-data.schema").Pesticide[]>;
    searchCommodities(query: SearchQueryDto): any[];
    searchDistricts(query: SearchQueryDto): any[];
    searchMandis(query: SearchQueryDto): any[];
    importData(): Promise<{
        success: boolean;
        message: string;
    }>;
}
