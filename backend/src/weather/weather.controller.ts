import {
  Controller,
  Get,
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
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WeatherService } from './weather.service';
import { GetWeatherHistoryDto } from './dto/get-weather.dto';

@ApiTags('Weather')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // -----------------------------------------------------------------------
  // GET /weather/current/:parcelId
  // -----------------------------------------------------------------------

  @Get('current/:parcelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current weather for a land parcel',
    description:
      'Returns the current weather for the GPS location of the specified land parcel. ' +
      'Data is served from MongoDB cache (30-minute TTL) or fetched live from OpenWeather API.',
  })
  @ApiParam({
    name: 'parcelId',
    description: 'ID of the land parcel',
    example: '3',
  })
  @ApiResponse({
    status: 200,
    description: 'Current weather returned successfully.',
    schema: {
      example: {
        locationId: '12.9716_77.5946',
        parcelId: '3',
        district: 'Bengaluru',
        state: '',
        country: 'IN',
        latitude: 12.9716,
        longitude: 77.5946,
        timestamp: '2024-06-25T09:00:00.000Z',
        temperature: 27.5,
        feelsLike: 29.0,
        humidity: 68,
        rainfall: 0,
        windSpeed: 3.2,
        pressure: 1012,
        weatherCondition: 'Clouds',
        weatherDescription: 'scattered clouds',
        weatherIcon: '03d',
        visibility: 10000,
        source: 'openweather',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized — missing or invalid JWT.' })
  @ApiResponse({ status: 403, description: 'Forbidden — parcel does not belong to this user.' })
  @ApiResponse({ status: 404, description: 'Land parcel not found or no GPS coordinates set.' })
  @ApiResponse({ status: 503, description: 'OpenWeather API is unavailable.' })
  async getCurrentWeather(@Param('parcelId') parcelId: string, @Req() req: any) {
    return this.weatherService.getCurrentWeather(parcelId, req.user.id);
  }

  // -----------------------------------------------------------------------
  // GET /weather/forecast/:parcelId
  // -----------------------------------------------------------------------

  @Get('forecast/:parcelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get 5-day weather forecast for a land parcel',
    description:
      'Returns a 5-day / 3-hour weather forecast for the parcel location. ' +
      'Data is cached in MongoDB for 3 hours before refreshing from OpenWeather.',
  })
  @ApiParam({
    name: 'parcelId',
    description: 'ID of the land parcel',
    example: '3',
  })
  @ApiResponse({
    status: 200,
    description: 'Forecast returned successfully.',
    schema: {
      example: {
        locationId: '12.9716_77.5946',
        parcelId: '3',
        latitude: 12.9716,
        longitude: 77.5946,
        source: 'cache',
        forecasts: [
          {
            forecastDate: '2024-06-26T00:00:00.000Z',
            temperature: 25.0,
            feelsLike: 26.5,
            humidity: 72,
            rainProbability: 40,
            windSpeed: 2.8,
            weatherCondition: 'Rain',
            weatherDescription: 'light rain',
            weatherIcon: '10d',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Parcel not found.' })
  @ApiResponse({ status: 503, description: 'OpenWeather API unavailable.' })
  async getForecast(@Param('parcelId') parcelId: string, @Req() req: any) {
    return this.weatherService.getForecast(parcelId, req.user.id);
  }

  // -----------------------------------------------------------------------
  // GET /weather/history/:parcelId
  // -----------------------------------------------------------------------

  @Get('history/:parcelId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get historical weather for a land parcel',
    description:
      'Returns stored historical weather records from MongoDB for the parcel location. ' +
      'Defaults to the last 7 days if no date range is provided.',
  })
  @ApiParam({
    name: 'parcelId',
    description: 'ID of the land parcel',
    example: '3',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (ISO 8601)',
    example: '2024-06-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (ISO 8601)',
    example: '2024-06-25T23:59:59.999Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical weather returned successfully.',
    schema: {
      example: {
        locationId: '12.9716_77.5946',
        parcelId: '3',
        startDate: '2024-06-18T00:00:00.000Z',
        endDate: '2024-06-25T00:00:00.000Z',
        history: [
          {
            timestamp: '2024-06-20T12:00:00.000Z',
            temperature: 28.3,
            humidity: 65,
            rainfall: 2.1,
            windSpeed: 4.0,
            pressure: 1010,
            weatherCondition: 'Rain',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Parcel not found.' })
  async getWeatherHistory(
    @Param('parcelId') parcelId: string,
    @Query() query: GetWeatherHistoryDto,
    @Req() req: any,
  ) {
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;
    return this.weatherService.getWeatherHistory(parcelId, req.user.id, startDate, endDate);
  }
}
