import { CropsService } from './crops.service';
export declare class CropsController {
    private cropsService;
    constructor(cropsService: CropsService);
    findAll(page?: string, limit?: string, search?: string, cropCategory?: string, season?: string): Promise<{
        data: import("./crop.entity").Crop[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        data: import("./crop.entity").Crop;
    }>;
}
