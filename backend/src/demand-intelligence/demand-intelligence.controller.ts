import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DemandIntelligenceService } from './demand-intelligence.service';
import { RegionalDemandQueryDto, DemandAnalyticsQueryDto, DemandActionQueryDto } from './dto/demand-query.dto';

/**
 * DemandIntelligenceController — Phase 14
 *
 * All routes under /demand-intelligence. JWT-protected.
 * Full Swagger documentation on every endpoint.
 */
@ApiTags('Demand Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('demand-intelligence')
export class DemandIntelligenceController {
  private readonly logger = new Logger(DemandIntelligenceController.name);

  constructor(private readonly demandService: DemandIntelligenceService) {}

  // ─── GET /demand-intelligence/summary ────────────────────────────────────

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'All active demand assessments for the authenticated user',
    description:
      'Returns the latest demand prediction for every active farmer crop belonging to the authenticated user. ' +
      'If no assessments exist, triggers a fresh bulk assessment automatically.',
  })
  @ApiResponse({ status: 200, description: 'Demand assessments returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSummary(@Request() req: any) {
    this.logger.log(`GET /demand-intelligence/summary | userId=${req.user?.id}`);
    return this.demandService.getSummary(req.user.id);
  }

  // ─── GET /demand-intelligence/risk ───────────────────────────────────────

  @Get('risk')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Demand risk summary (single crop or portfolio)',
    description:
      'Returns the demand risk assessment for a single crop (if farmerCropId is provided) or the highest-risk crop in the portfolio.',
  })
  @ApiQuery({ name: 'farmerCropId', required: false, example: '1' })
  @ApiResponse({ status: 200, description: 'Risk summary returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getRisk(@Request() req: any, @Query('farmerCropId') farmerCropId?: string) {
    this.logger.log(`GET /demand-intelligence/risk | userId=${req.user?.id} farmerCropId=${farmerCropId}`);
    return this.demandService.getRisk(farmerCropId, req.user.id);
  }

  // ─── GET /demand-intelligence/timeline ───────────────────────────────────

  @Get('timeline')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Demand timeline (single crop or portfolio)',
    description: 'Returns the 6-point demand timeline for a specific crop or all active crops in the portfolio.',
  })
  @ApiQuery({ name: 'farmerCropId', required: false, example: '1' })
  @ApiResponse({ status: 200, description: 'Demand timeline returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getTimeline(@Request() req: any, @Query('farmerCropId') farmerCropId?: string) {
    this.logger.log(`GET /demand-intelligence/timeline | userId=${req.user?.id} farmerCropId=${farmerCropId}`);
    return this.demandService.getTimeline(farmerCropId, req.user.id);
  }

  // ─── GET /demand-intelligence/regional ───────────────────────────────────

  @Get('regional')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Regional demand summary by level and name',
    description:
      'Returns aggregated demand across all active farmer crops for the specified region. ' +
      'level must be one of: village | taluk | district | state.',
  })
  @ApiQuery({ name: 'level', required: true, example: 'district', enum: ['village', 'taluk', 'district', 'state'] })
  @ApiQuery({ name: 'name', required: true, example: 'Bengaluru Urban' })
  @ApiResponse({ status: 200, description: 'Regional demand summary returned.' })
  @ApiResponse({ status: 400, description: 'Invalid region level.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getRegional(@Query() query: RegionalDemandQueryDto) {
    this.logger.log(`GET /demand-intelligence/regional | level=${query.level} name=${query.name}`);
    return this.demandService.getRegional(query.level ?? 'district', query.name ?? '');
  }

  // ─── GET /demand-intelligence/analytics ──────────────────────────────────

  @Get('analytics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Demand analytics with optional filtering',
    description:
      'Returns demand analytics snapshots. Can be filtered by regionLevel, regionName, and periodType. ' +
      'If no analytics exist, a fresh global snapshot is generated.',
  })
  @ApiQuery({ name: 'regionLevel', required: false, example: 'district' })
  @ApiQuery({ name: 'regionName', required: false, example: 'Bengaluru Urban' })
  @ApiQuery({ name: 'periodType', required: false, example: 'monthly' })
  @ApiQuery({ name: 'limit', required: false, example: '12' })
  @ApiResponse({ status: 200, description: 'Analytics data returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAnalytics(@Query() query: DemandAnalyticsQueryDto) {
    this.logger.log(`GET /demand-intelligence/analytics | ${JSON.stringify(query)}`);
    return this.demandService.getAnalytics(
      query.regionLevel,
      query.regionName,
      query.periodType,
      query.limit ? Number(query.limit) : undefined,
    );
  }

  // ─── GET /demand-intelligence/:cropId ─────────────────────────────────────

  @Get(':cropId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Single crop full demand assessment',
    description:
      'Returns the complete demand assessment for the specified farmer crop ID. ' +
      'If no assessment exists, triggers a fresh assessment automatically.',
  })
  @ApiParam({ name: 'cropId', description: 'Farmer crop ID', example: '1' })
  @ApiResponse({ status: 200, description: 'Demand assessment returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Farmer crop not found or access denied.' })
  async getAssessment(@Request() req: any, @Param('cropId') cropId: string) {
    this.logger.log(`GET /demand-intelligence/${cropId} | userId=${req.user?.id}`);
    return this.demandService.getAssessment(cropId, req.user.id);
  }

  // ─── POST /demand-intelligence/recalculate ────────────────────────────────

  @Post('recalculate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recalculate demand for one crop or full portfolio',
    description:
      'Triggers a fresh demand assessment. If farmerCropId is provided, recalculates only that crop. ' +
      'Otherwise recalculates all active crops for the authenticated user.',
  })
  @ApiQuery({ name: 'farmerCropId', required: false, example: '1' })
  @ApiResponse({ status: 200, description: 'Assessment(s) recalculated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async recalculate(@Request() req: any, @Query() query: DemandActionQueryDto) {
    this.logger.log(`POST /demand-intelligence/recalculate | userId=${req.user?.id} farmerCropId=${query.farmerCropId}`);
    if (query.farmerCropId) {
      return this.demandService.assess(query.farmerCropId, req.user.id);
    }
    return this.demandService.runBulkAssessment(req.user.id);
  }

  // ─── POST /demand-intelligence/recalculate-all ────────────────────────────

  @Post('recalculate-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk demand reassessment for ALL active crops (admin / scheduler)',
    description:
      'Recalculates demand intelligence for every active farmer crop in the system. ' +
      'Also refreshes global and regional demand analytics. Used by the daily scheduler job.',
  })
  @ApiResponse({ status: 200, description: 'Bulk assessment completed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async recalculateAll() {
    this.logger.log('POST /demand-intelligence/recalculate-all | admin bulk assessment');
    const result = await this.demandService.runBulkAssessment();
    await this.demandService.refreshAnalytics();
    return { ...result, message: 'Bulk demand assessment and analytics refresh completed.' };
  }
}
