import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
import { FarmerCrop } from '../farmer-crops/farmer-crop.entity';
export declare class LandParcel {
    id: string;
    farmerProfileId: string;
    farmerProfile: FarmerProfile;
    parcelName: string | null;
    areaAcres: number | null;
    soilType: string | null;
    landType: string | null;
    irrigationType: string | null;
    location: any;
    additionalMetadata: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    farmerCrops: FarmerCrop[];
}
