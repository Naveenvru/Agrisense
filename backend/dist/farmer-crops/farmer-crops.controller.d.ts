import { FarmerCropsService } from './farmer-crops.service';
import { CreateFarmerCropDto } from './dto/create-farmer-crop.dto';
import { UpdateFarmerCropDto } from './dto/update-farmer-crop.dto';
export declare class FarmerCropsController {
    private farmerCropsService;
    constructor(farmerCropsService: FarmerCropsService);
    create(req: any, createDto: CreateFarmerCropDto): Promise<{
        message: string;
        data: import("./farmer-crop.entity").FarmerCrop;
    }>;
    findAll(req: any): Promise<{
        data: import("./farmer-crop.entity").FarmerCrop[];
        count: number;
    }>;
    findOne(id: string, req: any): Promise<{
        data: import("./farmer-crop.entity").FarmerCrop;
    }>;
    update(id: string, req: any, updateDto: UpdateFarmerCropDto): Promise<{
        message: string;
        data: import("./farmer-crop.entity").FarmerCrop;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
