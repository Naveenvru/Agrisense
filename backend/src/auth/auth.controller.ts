import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import type { Response } from 'express';
import { GoogleLinkGuard } from './guards/google-link.guard';
import { SettingsService } from '../settings/settings.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private settingsService: SettingsService,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login user and get JWT' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Initiate Google OAuth' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guards handle redirection to Google
  }

  @ApiOperation({ summary: 'Google OAuth callback' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const oauthUser = req.user;
    const state = req.query?.state;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (state) {
      await this.settingsService.completeGoogleLink(String(state), oauthUser.googleId);
      res.redirect(`${frontendUrl}/settings?google=connected`);
      return;
    }
    const name = oauthUser.displayName || `${oauthUser.firstName || ''} ${oauthUser.lastName || ''}`.trim();
    const user = await this.authService.validateOAuthUser(
      oauthUser.email,
      name,
      oauthUser.googleId,
    );
    const { accessToken } = this.authService.generateToken(user);
    
    // Redirect to React frontend (Vite default port is 5173) with JWT token in query parameter
    res.redirect(`${frontendUrl}/oauth-callback?token=${accessToken}`);
  }

  @ApiOperation({ summary: 'Begin Google linking using a short-lived account settings ticket' })
  @Get('google/link')
  @UseGuards(GoogleLinkGuard)
  async googleLink() {}

  // Token login endpoint for React app directly calling Google OAuth SDK
  @ApiOperation({ summary: 'Get profile using Google access token' })
  @Post('google/token')
  @HttpCode(HttpStatus.OK)
  async googleTokenAuth(@Body('email') email: string, @Body('name') name: string) {
    const user = await this.authService.validateOAuthUser(email, name);
    const { accessToken } = this.authService.generateToken(user);
    
    const { passwordHash: _, ...result } = user;
    return {
      accessToken,
      user: result,
    };
  }

  @ApiOperation({ summary: 'Get current user profile (Protected)' })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { passwordHash: _, ...result } = user;
    return result;
  }
}
