import { MasterDataRepository } from '../repository/master-data.repository';
import { DataLakeService } from '../../storage/datalake/datalake.service';
export declare class GovernmentDataProvider {
    private readonly repository;
    private readonly dataLakeService;
    private readonly logger;
    private readonly mockData;
    constructor(repository: MasterDataRepository, dataLakeService: DataLakeService);
    importAll(): Promise<{
        success: boolean;
        message: string;
    }>;
}
