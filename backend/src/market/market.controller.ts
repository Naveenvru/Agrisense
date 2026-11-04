import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MarketService } from './market.service';
import { AiMlServiceClient } from '../ai/ai-ml-service.client';
import { CollectMarketDto } from './dto/collect-market.dto';
import { QueryMarketDto, QueryTrendsDto, PriceStatsDto } from './dto/query-market.dto';

/**
 * MarketController — Phase 9
 *
 * All routes under /market. JWT-protected.
 * Full Swagger documentation for every endpoint.
 */
@ApiTags('Market Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('market')
export class MarketController {
  private readonly logger = new Logger(MarketController.name);

  constructor(
    private readonly marketService: MarketService,
    private readonly aiMlClient: AiMlServiceClient,
  ) {}

  // -------------------------------------------------------------------------
  // GET /market/health
  // -------------------------------------------------------------------------

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Market Intelligence module health',
    description: 'Returns the operational status of the Market Intelligence module.',
  })
  @ApiResponse({ status: 200, description: 'Module operational.' })
  health() {
    return this.marketService.healthCheck();
  }

  // -------------------------------------------------------------------------
  // POST /market/collect
  // -------------------------------------------------------------------------

  @Post('collect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Trigger market data collection',
    description:
      'Runs the full market intelligence pipeline: ' +
      'collect raw data → store in Data Lake (storage/raw/market/) → ' +
      'validate quality → normalize → persist to MongoDB. ' +
      'Set MARKET_DATA_SOURCE=mandi-api to use the configured external provider. Provider failures are returned as collection failures; development mock collection requires MARKET_DATA_SOURCE=mock.',
  })
  @ApiResponse({
    status: 200,
    description: 'Collection pipeline completed.',
    schema: {
      example: {
        collectionResult: { status: 'success', recordsCollected: 8, durationMs: 12 },
        qualityResult: { totalInput: 8, totalValid: 8, totalRejected: 0, totalDuplicates: 0 },
        stored: { prices: 8, arrivals: 8 },
        dataLake: { stored: true },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid JWT.' })
  async collect(@Body() dto: CollectMarketDto) {
    this.logger.log(`POST /market/collect | ${JSON.stringify(dto)}`);
    return this.marketService.collect({
      commodity: dto.commodity,
      market: dto.market,
      state: dto.state,
      district: dto.district,
      date: dto.date ? new Date(dto.date) : undefined,
      limit: dto.limit,
    });
  }

  // -------------------------------------------------------------------------
  // GET /market/prices
  // -------------------------------------------------------------------------

  @Get('prices')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query normalized market prices',
    description:
      'Returns normalized market price records from MongoDB (market_prices_v2). ' +
      'Results are sorted chronologically by date descending.',
  })
  @ApiResponse({
    status: 200,
    description: 'Market prices returned.',
    schema: {
      example: [
        {
          commodity: 'Rice',
          market: 'Bengaluru APMC',
          district: 'Bengaluru Urban',
          state: 'Karnataka',
          date: '2026-06-26T00:00:00.000Z',
          minPrice: 2200,
          maxPrice: 2600,
          modalPrice: 2400,
          unit: 'Quintal',
          source: 'agmarknet',
          qualityScore: 100,
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPrices(@Query() query: QueryMarketDto, @Req() req: any) {
    return this.marketService.getPricesForUser(req.user.id, {
      commodity: query.commodity,
      market: query.market,
      district: query.district,
      state: query.state,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      limit: query.limit,
    });
  }

  // -------------------------------------------------------------------------
  // GET /market/prices/latest
  // -------------------------------------------------------------------------

  @Get('prices/latest')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get the latest price for a commodity and market',
    description: 'Returns the single most recent price record for the given commodity and market.',
  })
  @ApiQuery({ name: 'commodity', required: true, example: 'Rice' })
  @ApiQuery({ name: 'market', required: true, example: 'Bengaluru APMC' })
  @ApiResponse({ status: 200, description: 'Latest price returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getLatestPrice(
    @Query('commodity') commodity: string,
    @Query('market') market: string,
  ) {
    return this.marketService.getLatestPrice(commodity, market);
  }

  // -------------------------------------------------------------------------
  // GET /market/forecast
  // -------------------------------------------------------------------------

  @Get('forecast')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get multi-horizon AI price forecast for commodity and market',
    description: 'Retrieves multi-horizon AI price forecast from the FastAPI microservice.',
  })
  @ApiQuery({ name: 'commodity', required: true, example: 'Tomato' })
  @ApiQuery({ name: 'market', required: false, example: 'Bengaluru' })
  @ApiQuery({ name: 'state', required: false, example: 'Karnataka' })
  @ApiQuery({ name: 'horizonDays', required: false, example: 7 })
  async getForecast(
    @Query('commodity') commodity: string,
    @Query('market') market?: string,
    @Query('state') state?: string,
    @Query('horizonDays') horizonDays?: number,
  ) {
    const latest = await this.marketService.getLatestPrice(commodity, market || 'Bengaluru');
    const currentPrice = latest ? latest.modalPrice : 1450;
    return this.aiMlClient.getForecast({
      commodity,
      market: market || 'Bengaluru',
      state: state || 'Karnataka',
      currentModalPrice: currentPrice,
      horizonDays: horizonDays ? Number(horizonDays) : 7,
    });
  }

  // -------------------------------------------------------------------------
  // GET /market/arrivals
  // -------------------------------------------------------------------------

  @Get('arrivals')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query market arrival quantities',
    description:
      'Returns daily commodity arrival quantities for the specified filters. ' +
      'Results are sorted chronologically.',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrival data returned.',
    schema: {
      example: [
        {
          commodity: 'Onion',
          market: 'Nashik APMC',
          date: '2026-06-26T00:00:00.000Z',
          arrivalQty: 6200,
          unit: 'Quintal',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getArrivals(@Query() query: QueryMarketDto) {
    return this.marketService.getArrivals(
      query.commodity,
      query.market,
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined,
      query.limit,
    );
  }

  // -------------------------------------------------------------------------
  // GET /market/trends
  // -------------------------------------------------------------------------

  @Get('trends')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Query market price trends',
    description: 'Returns aggregated price trend records for the specified commodity, market, and period.',
  })
  @ApiResponse({ status: 200, description: 'Trend data returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getTrends(@Query() query: QueryTrendsDto) {
    return this.marketService.getTrends(
      query.commodity,
      query.market,
      query.period,
      query.limit,
    );
  }

  // -------------------------------------------------------------------------
  // GET /market/aggregations/price-stats
  // -------------------------------------------------------------------------

  @Get('aggregations/price-stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get price statistics (avg / min / max) via MongoDB aggregation',
    description:
      'Runs a MongoDB $group aggregation pipeline to compute average, minimum, and maximum ' +
      'prices for a commodity+market over a date range. No forecasting.',
  })
  @ApiResponse({
    status: 200,
    description: 'Price statistics returned.',
    schema: {
      example: {
        commodity: 'Rice',
        market: 'Bengaluru APMC',
        startDate: '2026-06-01T00:00:00.000Z',
        endDate: '2026-06-26T00:00:00.000Z',
        avgPrice: 2410.5,
        minPrice: 2200,
        maxPrice: 2600,
        recordCount: 12,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getPriceStats(@Query() query: PriceStatsDto) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return this.marketService.getPriceStats(
      query.commodity ?? '',
      query.market ?? '',
      query.startDate ? new Date(query.startDate) : thirtyDaysAgo,
      query.endDate ? new Date(query.endDate) : now,
    );
  }

  // -------------------------------------------------------------------------
  // GET /market/aggregations/arrivals
  // -------------------------------------------------------------------------

  @Get('aggregations/arrivals')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get total arrivals grouped by date via MongoDB aggregation',
    description:
      'Runs a MongoDB $group aggregation pipeline to compute total arrival quantities ' +
      'per date for a commodity+market pair. No forecasting.',
  })
  @ApiResponse({
    status: 200,
    description: 'Arrival totals returned.',
    schema: {
      example: [
        { commodity: 'Onion', market: 'Nashik APMC', date: '2026-06-26T00:00:00.000Z', totalArrival: 6200, unit: 'Quintal' },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getArrivalTotals(@Query() query: PriceStatsDto) {
    return this.marketService.getArrivalTotals(
      query.commodity ?? '',
      query.market ?? '',
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined,
    );
  }
}
