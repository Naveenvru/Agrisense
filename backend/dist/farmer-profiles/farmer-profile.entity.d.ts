import { User } from '../users/user.entity';
import { LandParcel } from '../land-parcels/land-parcel.entity';
export declare class FarmerProfile {
    id: string;
    userId: string;
    user: User;
    district: string | null;
    state: string | null;
    village: string | null;
    totalLandArea: number | null;
    primarySoilType: string | null;
    primaryIrrigationType: string | null;
    createdAt: Date;
    updatedAt: Date;
    landParcels: LandParcel[];
}
