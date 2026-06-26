import { OnApplicationBootstrap } from '@nestjs/common';
import { MasterDataRepository } from '../repository/master-data.repository';
export declare class HashMapService implements OnApplicationBootstrap {
    private readonly repository;
    private readonly logger;
    private readonly stateMap;
    private readonly districtMap;
    private readonly commodityMap;
    private readonly mandiMap;
    private readonly stateIdMap;
    private readonly districtIdMap;
    private readonly commodityIdMap;
    private readonly mandiIdMap;
    constructor(repository: MasterDataRepository);
    onApplicationBootstrap(): Promise<void>;
    refreshAll(): Promise<void>;
    getStateId(name: string): string | undefined;
    getStateById(id: string): any;
    getDistrictId(name: string): string | undefined;
    getDistrictById(id: string): any;
    getCommodityId(name: string): string | undefined;
    getCommodityById(id: string): any;
    getMandiId(name: string): string | undefined;
    getMandiById(id: string): any;
}
