import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import type { Response } from 'express';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(registerDto: RegisterDto): Promise<Omit<import("../users/user.entity").User, "passwordHash">>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: Omit<import("../users/user.entity").User, "passwordHash">;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any, res: Response): Promise<void>;
    googleTokenAuth(email: string, name: string): Promise<{
        accessToken: string;
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
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
            farmerProfile: import("../farmer-profiles/farmer-profile.entity").FarmerProfile;
        };
    }>;
    getProfile(req: any): Promise<{
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
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        farmerProfile: import("../farmer-profiles/farmer-profile.entity").FarmerProfile;
    }>;
}
