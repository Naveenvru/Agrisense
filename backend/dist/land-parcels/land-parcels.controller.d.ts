import { LandParcelsService } from './land-parcels.service';
import { CreateLandParcelDto } from './dto/create-land-parcel.dto';
import { UpdateLandParcelDto } from './dto/update-land-parcel.dto';
export declare class LandParcelsController {
    private landParcelsService;
    constructor(landParcelsService: LandParcelsService);
    create(req: any, createDto: CreateLandParcelDto): Promise<{
        message: string;
        data: any;
    }>;
    findAll(req: any): Promise<{
        data: any[];
        count: number;
    }>;
    findOne(id: string, req: any): Promise<{
        data: any;
    }>;
    update(id: string, req: any, updateDto: UpdateLandParcelDto): Promise<{
        message: string;
        data: any;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
