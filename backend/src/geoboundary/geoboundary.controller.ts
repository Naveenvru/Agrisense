import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GeoBoundaryService } from './geoboundary.service';
import { ReverseGeocodeDto } from './dto/geoboundary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('GeoBoundary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('geoboundary')
export class GeoBoundaryController {
  constructor(private readonly geoboundaryService: GeoBoundaryService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GeoBoundary module health check' })
  @ApiResponse({ status: 200, description: 'Module status returned.' })
  health() {
    return this.geoboundaryService.healthCheck();
  }

  @Get('reverse')
  @ApiOperation({ summary: 'Reverse geocode coordinates to administrative boundaries' })
  @ApiResponse({ status: 200, description: 'GeoBoundary Result containing resolved IDs and strings.' })
  async reverseGeocode(@Query() query: ReverseGeocodeDto) {
    return this.geoboundaryService.resolveLocation(query.lat, query.lon);
  }
}
