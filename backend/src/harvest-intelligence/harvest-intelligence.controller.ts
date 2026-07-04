import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HarvestIntelligenceService } from './harvest-intelligence.service';
import { RegionalQueryDto, AnalyticsQueryDto, HistoryQueryDto } from './dto/harvest-query.dto';

/**
 * HarvestIntelligenceController
 *
 * Phase 11 REST API surface for harvest intelligence.
 * All endpoints are JWT-protected and return explainable results.
 *
 * Base path: /harvest-intelligence
 */
@ApiTags('Harvest Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('harvest-intelligence')
export class HarvestIntelligenceController {
  constructor(private readonly service: HarvestIntelligenceService) {}

  // ---------------------------------------------------------------------------
  // Summary — full assessment for a specific crop
  // ---------------------------------------------------------------------------

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all active crop assessments for the authenticated user',
    description:
      'Returns the latest harvest intelligence assessment for every active farmer crop ' +
      'belonging to the authenticated user. Triggers first-time assessment if not yet computed.',
  })
  @ApiResponse({ status: 200, description: 'All assessments returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSummary(@Req() req: any) {
    const assessments = await this.service.getMyAssessments(req.user.id);
    return {
      data: assessments,
      count: assessments.length,
    };
  }

  // ---------------------------------------------------------------------------
  // Per-crop full assessment
  // ---------------------------------------------------------------------------

  @Get(':farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get complete harvest intelligence for a farmer crop',
    description:
      'Returns full harvest intelligence: lifecycle stage, readiness, harvest window, ' +
      'risk, delay detection, yield estimate, quality, labour, equipment, and storage advice. ' +
      'Runs a fresh assessment on first access; subsequent calls return cached MongoDB data.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'ID of the farmer crop', example: '1' })
  @ApiResponse({ status: 200, description: 'Full assessment returned.' })
  @ApiResponse({ status: 400, description: 'Sowing date not set on this crop.' })
  @ApiResponse({ status: 404, description: 'Farmer crop not found.' })
  async getAssessment(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getAssessment(id, req.user.id);
    return { data };
  }

  // ---------------------------------------------------------------------------
  // Readiness
  // ---------------------------------------------------------------------------

  @Get('readiness/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get harvest readiness for a farmer crop',
    description: 'Returns readiness score (0-100), status, and explanation. Status: not-ready | developing | almost-ready | ready | harvested.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Readiness assessment returned.' })
  async getReadiness(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getReadiness(id, req.user.id);
    return { data };
  }

  // ---------------------------------------------------------------------------
  // Harvest Window
  // ---------------------------------------------------------------------------

  @Get('window/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get harvest window for a farmer crop',
    description: 'Returns earliest, optimal, and latest safe harvest dates. ' +
      'Window is recalculated when weather or lifecycle changes.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Harvest window returned.' })
  async getWindow(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getWindow(id, req.user.id);
    return { data };
  }

  // ---------------------------------------------------------------------------
  // Risk
  // ---------------------------------------------------------------------------

  @Get('risk/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get harvest risk analysis for a farmer crop',
    description: 'Returns risk level (low|medium|high|critical), risk factors, and mitigation recommendations.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Risk analysis returned.' })
  async getRisk(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getRisk(id, req.user.id);
    return { data };
  }

  // ---------------------------------------------------------------------------
  // History
  // ---------------------------------------------------------------------------

  @Get('history/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get harvest prediction history for a farmer crop',
    description: 'Returns all historical assessment versions, newest first. Useful for AI training and audit.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max entries to return', example: '10' })
  @ApiResponse({ status: 200, description: 'Prediction history returned.' })
  async getHistory(@Param('farmerCropId') id: string, @Query() query: HistoryQueryDto, @Req() req: any) {
    const limit = query.limit ? parseInt(query.limit, 10) : 20;
    const data = await this.service.getHistory(id, req.user.id, limit);
    return { data, count: data.length };
  }

  // ---------------------------------------------------------------------------
  // Estimate (yield, quality, labour, equipment, storage)
  // ---------------------------------------------------------------------------

  @Get('estimate/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get harvest estimate for a farmer crop',
    description: 'Returns expected yield, quality grade, labour estimate, equipment recommendations, and storage advice. ' +
      'Does NOT include revenue or price — those belong to Phase 15.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Harvest estimate returned.' })
  async getEstimate(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.getEstimate(id, req.user.id);
    return { data };
  }

  // ---------------------------------------------------------------------------
  // Regional
  // ---------------------------------------------------------------------------

  @Get('regional/summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get regional harvest summary',
    description: 'Aggregates harvest intelligence across village, taluk, district, or state. Reuses PostGIS location data.',
  })
  @ApiQuery({ name: 'level', required: true, enum: ['village', 'taluk', 'district', 'state'], example: 'district' })
  @ApiQuery({ name: 'name', required: true, description: 'Region name', example: 'Bengaluru Urban' })
  @ApiResponse({ status: 200, description: 'Regional summary returned.' })
  async getRegional(@Query() query: RegionalQueryDto) {
    const data = await this.service.getRegional(query.level, query.name);
    return { data };
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------

  @Get('analytics/trends')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get harvest analytics and trends',
    description: 'Returns stored monthly/weekly harvest analytics from MongoDB. Filter by region level, region name, and period type.',
  })
  @ApiQuery({ name: 'regionLevel', required: false, example: 'district' })
  @ApiQuery({ name: 'regionName', required: false, example: 'Bengaluru' })
  @ApiQuery({ name: 'periodType', required: false, enum: ['weekly', 'monthly'], example: 'monthly' })
  @ApiQuery({ name: 'limit', required: false, example: '12' })
  @ApiResponse({ status: 200, description: 'Analytics returned.' })
  async getAnalytics(@Query() query: AnalyticsQueryDto) {
    const limit = query.limit ? parseInt(query.limit, 10) : 12;
    const data = await this.service.getAnalytics(
      query.regionLevel ?? 'district',
      query.regionName,
      query.periodType,
      limit,
    );
    return { data, count: data.length };
  }

  // ---------------------------------------------------------------------------
  // Recalculate (manual trigger / admin)
  // ---------------------------------------------------------------------------

  @Post('recalculate/:farmerCropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Force recalculate harvest intelligence for a farmer crop',
    description: 'Triggers a fresh assessment regardless of cache. Useful when sowing date, yield estimate, or weather changes significantly.',
  })
  @ApiParam({ name: 'farmerCropId', description: 'Farmer crop ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Recalculated assessment returned.' })
  async recalculate(@Param('farmerCropId') id: string, @Req() req: any) {
    const data = await this.service.assess(id, req.user.id);
    return {
      message: 'Harvest intelligence recalculated successfully',
      data,
    };
  }

  @Post('recalculate-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Trigger bulk harvest assessment for all active crops',
    description: 'Runs the daily harvest assessment job on demand. Used by admin or scheduler during Phase 8.8 activation.',
  })
  @ApiResponse({ status: 200, description: 'Bulk assessment completed.' })
  async recalculateAll() {
    const result = await this.service.runBulkAssessment();
    return {
      message: `Bulk assessment complete: ${result.assessed} assessed, ${result.failed} failed`,
      ...result,
    };
  }
}
