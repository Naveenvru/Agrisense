import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FarmerProfilesService } from './farmer-profiles.service';
import { CreateFarmerProfileDto } from './dto/create-farmer-profile.dto';
import { UpdateFarmerProfileDto } from './dto/update-farmer-profile.dto';

@ApiTags('Farmer Profile')
@ApiBearerAuth()
@Controller('farmer-profile')
@UseGuards(JwtAuthGuard)
export class FarmerProfilesController {
  constructor(private farmerProfilesService: FarmerProfilesService) {}

  @ApiOperation({ summary: 'Create farmer profile' })
  @Post()
  async create(@Req() req: any, @Body() createDto: CreateFarmerProfileDto) {
    const profile = await this.farmerProfilesService.create(req.user.id, createDto);
    return {
      message: 'Farmer profile created successfully',
      data: profile,
    };
  }

  @ApiOperation({ summary: 'Get current user farmer profile' })
  @Get('me')
  async getMyProfile(@Req() req: any) {
    const profile = await this.farmerProfilesService.findByUserId(req.user.id);
    // Strip password hash from the nested user relation
    if (profile.user) {
      const { passwordHash, ...safeUser } = profile.user;
      return {
        data: { ...profile, user: safeUser },
      };
    }
    return { data: profile };
  }

  @ApiOperation({ summary: 'Update current user farmer profile' })
  @Put('me')
  async updateMyProfile(
    @Req() req: any,
    @Body() updateDto: UpdateFarmerProfileDto,
  ) {
    const profile = await this.farmerProfilesService.update(req.user.id, updateDto);
    return {
      message: 'Farmer profile updated successfully',
      data: profile,
    };
  }
}
