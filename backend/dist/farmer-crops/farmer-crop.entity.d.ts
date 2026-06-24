import { LandParcel } from '../land-parcels/land-parcel.entity';
import { Crop } from '../crops/crop.entity';
export declare enum CropStatus {
    ACTIVE = "active",
    HARVESTED = "harvested",
    FAILED = "failed"
}
export declare class FarmerCrop {
    id: string;
    parcelId: string;
    cropId: string;
    parcel: LandParcel;
    crop: Crop;
    cropVariety: string | null;
    sowingDate: Date | null;
    expectedHarvestDate: Date | null;
    estimatedYieldKg: number | null;
    actualYieldKg: number | null;
    status: CropStatus;
    createdAt: Date;
    updatedAt: Date;
}
