import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VegetationService } from './vegetation.service';

@ApiTags('Vegetation Monitoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vegetation')
export class VegetationController {
  constructor(private readonly vegetationService: VegetationService) {}

  @ApiOperation({ summary: 'Queue a cloud-masked Sentinel-2 NDVI statistics job for an owned farm parcel' })
  @Post('parcels/:parcelId/jobs')
  async createJob(@Req() req: any, @Param('parcelId') parcelId: string, @Body() body: { dateFrom?: string; dateTo?: string; maxCloudCoverage?: number }) {
    return { data: await this.vegetationService.createJob(req.user.id, parcelId, body || {}) };
  }

  @ApiOperation({ summary: 'Get a vegetation job only when the signed-in farmer owns its parcel' })
  @Get('jobs/:jobId')
  async getJob(@Req() req: any, @Param('jobId') jobId: string) {
    return { data: await this.vegetationService.getJob(req.user.id, jobId) };
  }

  @ApiOperation({ summary: 'Retry a terminal vegetation job for an owned parcel' })
  @Post('jobs/:jobId/retry')
  async retryJob(@Req() req: any, @Param('jobId') jobId: string) {
    return { data: await this.vegetationService.retryJob(req.user.id, jobId) };
  }

  @ApiOperation({ summary: 'Get actual persisted NDVI observations and recent processing jobs for an owned parcel' })
  @Get('parcels/:parcelId')
  async getParcelData(@Req() req: any, @Param('parcelId') parcelId: string) {
    return { data: await this.vegetationService.getParcelData(req.user.id, parcelId) };
  }
}
