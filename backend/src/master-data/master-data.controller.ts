import { Controller, Get, Post, Query, HttpCode, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchQueryDto, DistrictQueryDto, TalukQueryDto, VillageQueryDto, MandiQueryDto, CropVarietyQueryDto } from './dto/master-data.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MasterDataService } from './master-data.service';

@ApiTags('Agricultural Master Data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('master')
export class MasterDataController {
  private readonly logger = new Logger(MasterDataController.name);

  constructor(private readonly masterDataService: MasterDataService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Master Data module health check' })
  @ApiResponse({ status: 200, description: 'Module status returned.' })
  health() {
    return this.masterDataService.healthCheck();
  }

  // ---------------------------------------------------------------------------
  // Master Data Listing Endpoints
  // ---------------------------------------------------------------------------

  @Get('states')
  @ApiOperation({ summary: 'Get all states (alphabetical)' })
  @ApiResponse({ status: 200, description: 'List of states' })
  getStates() {
    return this.masterDataService.getStates();
  }

  @Get('districts')
  @ApiOperation({ summary: 'Get districts, optionally filtered by state' })
  @ApiResponse({ status: 200, description: 'List of districts' })
  getDistricts(@Query() query: DistrictQueryDto) {
    return this.masterDataService.getDistricts(query.stateId);
  }

  @Get('taluks')
  @ApiOperation({ summary: 'Get taluks, optionally filtered by district' })
  @ApiResponse({ status: 200, description: 'List of taluks' })
  getTaluks(@Query() query: TalukQueryDto) {
    return this.masterDataService.getTaluks(query.districtId);
  }

  @Get('villages')
  @ApiOperation({ summary: 'Get villages, optionally filtered by taluk' })
  @ApiResponse({ status: 200, description: 'List of villages' })
  getVillages(@Query() query: VillageQueryDto) {
    return this.masterDataService.getVillages(query.talukId);
  }

  @Get('markets')
  @ApiOperation({ summary: 'Get mandis/markets, optionally filtered by district' })
  @ApiResponse({ status: 200, description: 'List of mandis' })
  getMandis(@Query() query: MandiQueryDto) {
    return this.masterDataService.getMandis(query.districtId);
  }

  @Get('commodities')
  @ApiOperation({ summary: 'Get all commodities (alphabetical)' })
  @ApiResponse({ status: 200, description: 'List of commodities' })
  getCommodities() {
    return this.masterDataService.getCommodities();
  }

  @Get('crop-varieties')
  @ApiOperation({ summary: 'Get crop varieties, optionally filtered by commodity' })
  @ApiResponse({ status: 200, description: 'List of crop varieties' })
  getCropVarieties(@Query() query: CropVarietyQueryDto) {
    return this.masterDataService.getCropVarieties(query.commodityId);
  }

  @Get('seasons')
  @ApiOperation({ summary: 'Get all agricultural seasons' })
  @ApiResponse({ status: 200, description: 'List of seasons' })
  getSeasons() {
    return this.masterDataService.getSeasons();
  }

  @Get('soil-types')
  @ApiOperation({ summary: 'Get all soil types' })
  @ApiResponse({ status: 200, description: 'List of soil types' })
  getSoilTypes() {
    return this.masterDataService.getSoilTypes();
  }

  @Get('irrigation-types')
  @ApiOperation({ summary: 'Get all irrigation types' })
  @ApiResponse({ status: 200, description: 'List of irrigation types' })
  getIrrigationTypes() {
    return this.masterDataService.getIrrigationTypes();
  }

  @Get('fertilizers')
  @ApiOperation({ summary: 'Get all fertilizers' })
  @ApiResponse({ status: 200, description: 'List of fertilizers' })
  getFertilizers() {
    return this.masterDataService.getFertilizers();
  }

  @Get('pesticides')
  @ApiOperation({ summary: 'Get all pesticides' })
  @ApiResponse({ status: 200, description: 'List of pesticides' })
  getPesticides() {
    return this.masterDataService.getPesticides();
  }

  // ---------------------------------------------------------------------------
  // Search Endpoints (Trie O(m) Prefix Search)
  // ---------------------------------------------------------------------------

  @Get('search/commodities')
  @ApiOperation({ summary: 'Search commodities by prefix (autocomplete)' })
  @ApiResponse({ status: 200, description: 'Matching commodities' })
  searchCommodities(@Query() query: SearchQueryDto) {
    return this.masterDataService.searchCommodities(query.q || '');
  }

  @Get('search/districts')
  @ApiOperation({ summary: 'Search districts by prefix (autocomplete)' })
  @ApiResponse({ status: 200, description: 'Matching districts' })
  searchDistricts(@Query() query: SearchQueryDto) {
    return this.masterDataService.searchDistricts(query.q || '');
  }

  @Get('search/markets')
  @ApiOperation({ summary: 'Search markets/mandis by prefix (autocomplete)' })
  @ApiResponse({ status: 200, description: 'Matching markets' })
  searchMandis(@Query() query: SearchQueryDto) {
    return this.masterDataService.searchMandis(query.q || '');
  }

  // ---------------------------------------------------------------------------
  // Import Endpoint
  // ---------------------------------------------------------------------------

  @Post('import')
  @ApiOperation({ summary: 'Trigger master data import from GovernmentDataProvider' })
  @ApiResponse({ status: 200, description: 'Import result' })
  importData() {
    return this.masterDataService.triggerImport();
  }
}
