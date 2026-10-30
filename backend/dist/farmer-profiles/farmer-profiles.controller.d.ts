import { FarmerProfilesService } from './farmer-profiles.service';
import { CreateFarmerProfileDto } from './dto/create-farmer-profile.dto';
import { UpdateFarmerProfileDto } from './dto/update-farmer-profile.dto';
export declare class FarmerProfilesController {
    private farmerProfilesService;
    constructor(farmerProfilesService: FarmerProfilesService);
    create(req: any, createDto: CreateFarmerProfileDto): Promise<{
        message: string;
        data: import("./farmer-profile.entity").FarmerProfile;
    }>;
    getMyProfile(req: any): Promise<{
        data: {
            user: {
                id: string;
                name: string;
                email: string;
                googleId: string | null;
                authProvider: string;
                isEmailVerified: boolean;
                phoneNumber: string | null;
                role: import("../users/user.entity").UserRole;
                preferredLanguage: string;
                isActive: boolean;
                tokenVersion: number;
                lastLogin: Date | null;
                createdAt: Date;
                updatedAt: Date;
                farmerProfile: import("./farmer-profile.entity").FarmerProfile;
            };
            id: string;
            userId: string;
            district: string | null;
            state: string | null;
            village: string | null;
            totalLandArea: number | null;
            primarySoilType: string | null;
            primaryIrrigationType: string | null;
            createdAt: Date;
            updatedAt: Date;
            landParcels: import("../land-parcels/land-parcel.entity").LandParcel[];
        };
    }>;
    updateMyProfile(req: any, updateDto: UpdateFarmerProfileDto): Promise<{
        message: string;
        data: import("./farmer-profile.entity").FarmerProfile;
    }>;
}
