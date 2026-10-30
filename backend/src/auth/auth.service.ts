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
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
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
      authProvider: 'local',
      isEmailVerified: false,
      isActive: true,
    });
    await this.notificationsService.getPreferences(user.id);

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.usersService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('This account was created using Google Sign-In. Please click "Continue with Google".');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    await this.usersService.updateLastLogin(user.id);

    const payload = { sub: user.id, email: user.email, role: user.role, tokenVersion: user.tokenVersion ?? 0 };
    const { passwordHash: _, ...result } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: result,
    };
  }

  async validateOAuthUser(email: string, name: string, googleId?: string): Promise<User> {
    let user: User | null = null;

    if (googleId) {
      user = await this.usersService.findOneByGoogleId(googleId);
    }

    if (!user && email) {
      user = await this.usersService.findOneByEmail(email);
      if (user) {
        // Link Google ID to existing user account
        user = await this.usersService.update(user.id, {
          googleId: googleId || user.googleId,
          isEmailVerified: true,
        });
      }
    }

    if (!user) {
      user = await this.usersService.create({
        name: name || email.split('@')[0],
        email,
        passwordHash: null,
        googleId: googleId || null,
        authProvider: 'google',
        isEmailVerified: true,
        role: UserRole.FARMER,
        isActive: true,
      });
      await this.notificationsService.getPreferences(user.id);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    await this.usersService.updateLastLogin(user.id);
    return user;
  }

  generateToken(user: User): { accessToken: string } {
    const payload = { sub: user.id, email: user.email, role: user.role, tokenVersion: user.tokenVersion ?? 0 };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
