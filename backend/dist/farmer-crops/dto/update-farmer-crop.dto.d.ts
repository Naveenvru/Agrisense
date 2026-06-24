import { CropStatus } from '../farmer-crop.entity';
export declare class UpdateFarmerCropDto {
    cropVariety?: string;
    sowingDate?: string;
    expectedHarvestDate?: string;
    estimatedYieldKg?: number;
    actualYieldKg?: number;
    status?: CropStatus;
}
