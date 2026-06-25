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

@ApiTags('Farmer Crops')
@ApiBearerAuth()
@Controller('farmer-crops')
@UseGuards(JwtAuthGuard)
export class FarmerCropsController {
  constructor(private farmerCropsService: FarmerCropsService) {}

  @ApiOperation({ summary: 'Assign crop to land parcel' })
  @Post()
  async create(@Req() req: any, @Body() createDto: CreateFarmerCropDto) {
    const farmerCrop = await this.farmerCropsService.create(req.user.id, createDto);
    return {
      message: 'Farmer crop assigned successfully',
      data: farmerCrop,
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
