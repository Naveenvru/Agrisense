import { UserRole } from '../../users/user.entity';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: UserRole;
    preferredLanguage?: string;
}
