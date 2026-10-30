import { FarmerCropsService } from './farmer-crops.service';
import { CreateFarmerCropDto } from './dto/create-farmer-crop.dto';
import { UpdateFarmerCropDto } from './dto/update-farmer-crop.dto';
import { CreateCropConditionDto } from './dto/create-crop-condition.dto';
export declare class FarmerCropsController {
    private farmerCropsService;
    constructor(farmerCropsService: FarmerCropsService);
    create(req: any, createDto: CreateFarmerCropDto): Promise<{
        message: string;
        data: import("./farmer-crop.entity").FarmerCrop;
        calendar: {
            eventsGenerated: number;
            warning: string | undefined;
        };
    }>;
    findAll(req: any): Promise<{
        data: import("./farmer-crop.entity").FarmerCrop[];
        count: number;
    }>;
    findOne(id: string, req: any): Promise<{
        data: import("./farmer-crop.entity").FarmerCrop;
    }>;
    findConditions(id: string, req: any): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./crop-condition.schema").CropCondition, {}, import("mongoose").DefaultSchemaOptions> & import("./crop-condition.schema").CropCondition & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
        count: number;
    }>;
    createCondition(id: string, req: any, dto: CreateCropConditionDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("./crop-condition.schema").CropCondition, {}, import("mongoose").DefaultSchemaOptions> & import("./crop-condition.schema").CropCondition & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        calendar: {
            updated: boolean;
            warning: string | undefined;
        };
    }>;
    regenerateCalendar(id: string, req: any): Promise<{
        message: string;
        data: {
            taskCount: number;
            source: string;
            updated: boolean;
            warning?: string;
            generatedTaskCount?: number;
        };
    }>;
    update(id: string, req: any, updateDto: UpdateFarmerCropDto): Promise<{
        message: string;
        data: import("./farmer-crop.entity").FarmerCrop;
    }>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
