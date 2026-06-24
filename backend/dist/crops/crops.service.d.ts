import { Repository } from 'typeorm';
import { Crop } from './crop.entity';
export declare class CropsService {
    private cropsRepository;
    constructor(cropsRepository: Repository<Crop>);
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        cropCategory?: string;
        season?: string;
    }): Promise<{
        data: Crop[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Crop>;
}
