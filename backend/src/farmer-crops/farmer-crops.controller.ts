import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FarmerCropsService } from './farmer-crops.service';
import { CreateFarmerCropDto } from './dto/create-farmer-crop.dto';
import { UpdateFarmerCropDto } from './dto/update-farmer-crop.dto';
import { CreateCropConditionDto } from './dto/create-crop-condition.dto';

@ApiTags('Farmer Crops')
@ApiBearerAuth()
@Controller('farmer-crops')
@UseGuards(JwtAuthGuard)
export class FarmerCropsController {
  constructor(private farmerCropsService: FarmerCropsService) {}

  @ApiOperation({ summary: 'Assign crop to land parcel' })
  @Post()
  async create(@Req() req: any, @Body() createDto: CreateFarmerCropDto) {
    const result = await this.farmerCropsService.create(req.user.id, createDto);
    return {
      message: 'Farmer crop assigned successfully',
      data: result.crop,
      calendar: { eventsGenerated: result.calendarCount, warning: result.calendarError },
    };
  }

  @ApiOperation({ summary: 'List user farmer crops' })
  @Get()
  async findAll(@Req() req: any) {
    const farmerCrops = await this.farmerCropsService.findAll(req.user.id);
    return {
      data: farmerCrops,
      count: farmerCrops.length,
    };
  }

  @ApiOperation({ summary: 'Get specific farmer crop' })
  @ApiParam({ name: 'id', description: 'ID of the farmer crop', example: '3' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const farmerCrop = await this.farmerCropsService.findOne(id, req.user.id);
    return {
      data: farmerCrop,
    };
  }

  @ApiOperation({ summary: 'List manual field condition observations for a crop cycle' })
  @Get(':id/conditions')
  async findConditions(@Param('id') id: string, @Req() req: any) {
    const observations = await this.farmerCropsService.findConditions(id, req.user.id);
    return { data: observations, count: observations.length };
  }

  @ApiOperation({ summary: 'Record a manual field condition observation for a crop cycle' })
  @Post(':id/conditions')
  async createCondition(@Param('id') id: string, @Req() req: any, @Body() dto: CreateCropConditionDto) {
    const result = await this.farmerCropsService.createCondition(id, req.user.id, dto);
    return {
      message: 'Field condition recorded',
      data: result.observation,
      calendar: { updated: result.calendarUpdated, warning: result.calendarWarning },
    };
  }

  @ApiOperation({ summary: 'Regenerate upcoming crop calendar tasks with Gemini using saved field conditions' })
  @Post(':id/calendar/regenerate')
  async regenerateCalendar(@Param('id') id: string, @Req() req: any) {
    const result = await this.farmerCropsService.regenerateCalendar(id, req.user.id);
    return { message: result.updated ? 'Crop calendar updated with Gemini' : 'Crop calendar was not updated', data: result };
  }

  @ApiOperation({ summary: 'Update specific farmer crop' })
  @ApiParam({ name: 'id', description: 'ID of the farmer crop', example: '3' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateDto: UpdateFarmerCropDto,
  ) {
    const farmerCrop = await this.farmerCropsService.update(id, req.user.id, updateDto);
    return {
      message: 'Farmer crop updated successfully',
      data: farmerCrop,
    };
  }

  @ApiOperation({ summary: 'Delete specific farmer crop' })
  @ApiParam({ name: 'id', description: 'ID of the farmer crop', example: '3' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.farmerCropsService.remove(id, req.user.id);
    return {
      message: 'Farmer crop deleted successfully',
    };
  }
}
