import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<Omit<User, 'passwordHash'>>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: Omit<User, 'passwordHash'>;
    }>;
    validateOAuthUser(email: string, name: string): Promise<User>;
    generateToken(user: User): {
        accessToken: string;
    };
}
