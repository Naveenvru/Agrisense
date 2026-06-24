import { FarmerProfile } from '../farmer-profiles/farmer-profile.entity';
export declare enum UserRole {
    FARMER = "farmer",
    BUYER = "buyer",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    phoneNumber: string | null;
    role: UserRole;
    preferredLanguage: string;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    farmerProfile: FarmerProfile;
}
