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
import { LandParcelsService } from './land-parcels.service';
import { CreateLandParcelDto } from './dto/create-land-parcel.dto';
import { UpdateLandParcelDto } from './dto/update-land-parcel.dto';

@ApiTags('Land Parcels')
@ApiBearerAuth()
@Controller('land-parcels')
@UseGuards(JwtAuthGuard)
export class LandParcelsController {
  constructor(private landParcelsService: LandParcelsService) {}

  @ApiOperation({ summary: 'Create land parcel' })
  @Post()
  async create(@Req() req: any, @Body() createDto: CreateLandParcelDto) {
    const parcel = await this.landParcelsService.create(req.user.id, createDto);
    return {
      message: 'Land parcel created successfully',
      data: parcel,
    };
  }

  @ApiOperation({ summary: 'List user land parcels' })
  @Get()
  async findAll(@Req() req: any) {
    const parcels = await this.landParcelsService.findAllByUser(req.user.id);
    return {
      data: parcels,
      count: parcels.length,
    };
  }

  @ApiOperation({ summary: 'Get a specific land parcel' })
  @ApiParam({ name: 'id', description: 'ID of the land parcel', example: '3' })
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const parcel = await this.landParcelsService.findOneByUser(id, req.user.id);
    return {
      data: parcel,
    };
  }

  @ApiOperation({ summary: 'Update a specific land parcel' })
  @ApiParam({ name: 'id', description: 'ID of the land parcel', example: '3' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateDto: UpdateLandParcelDto,
  ) {
    const parcel = await this.landParcelsService.update(id, req.user.id, updateDto);
    return {
      message: 'Land parcel updated successfully',
      data: parcel,
    };
  }

  @ApiOperation({ summary: 'Delete a specific land parcel' })
  @ApiParam({ name: 'id', description: 'ID of the land parcel', example: '3' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req: any) {
    await this.landParcelsService.remove(id, req.user.id);
    return {
      message: 'Land parcel deleted successfully',
    };
  }
}
