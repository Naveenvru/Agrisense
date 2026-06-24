import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const existingUser = await this.usersService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      passwordHash,
      phoneNumber: registerDto.phoneNumber || null,
      role: registerDto.role,
      preferredLanguage: registerDto.preferredLanguage || 'en',
      isActive: true,
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    await this.usersService.updateLastLogin(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const { passwordHash: _, ...result } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: result,
    };
  }

  async validateOAuthUser(email: string, name: string): Promise<User> {
    let user = await this.usersService.findOneByEmail(email);
    
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      
      user = await this.usersService.create({
        name,
        email,
        passwordHash,
        role: UserRole.FARMER,
        isActive: true,
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    await this.usersService.updateLastLogin(user.id);
    return user;
  }

  generateToken(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
