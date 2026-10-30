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
  Query,
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

  @ApiOperation({ summary: 'Calculate area and centroid for a GeoJSON farm boundary using PostGIS' })
  @Post('area-preview')
  async previewArea(@Body() body: { boundaryGeoJson: unknown }) {
    return { data: await this.landParcelsService.previewArea(body?.boundaryGeoJson) };
  }

  @ApiOperation({ summary: 'Find the signed-in farmer’s own parcels within a radius' })
  @Get('spatial/nearby')
  async findNearby(
    @Req() req: any,
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radiusMeters') radiusMeters = '10000',
  ) {
    return {
      data: await this.landParcelsService.findNearby(
        req.user.id,
        Number(latitude),
        Number(longitude),
        Number(radiusMeters),
      ),
    };
  }

  @ApiOperation({ summary: 'Find the signed-in farmer’s parcels containing a coordinate (boundary inclusive)' })
  @Get('spatial/containing')
  async findContaining(
    @Req() req: any,
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
  ) {
    return { data: await this.landParcelsService.findContaining(req.user.id, Number(latitude), Number(longitude)) };
  }

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

  @ApiOperation({ summary: 'Check for potential boundary overlaps with other parcels; does not expose their details' })
  @Get(':id/overlap-summary')
  async overlapSummary(@Param('id') id: string, @Req() req: any) {
    return { data: await this.landParcelsService.overlapSummary(id, req.user.id) };
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
