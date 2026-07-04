import { Controller, Get, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GeoBoundaryService } from './geoboundary.service';
import { ReverseGeocodeDto, PolygonLookupDto } from './dto/geoboundary.dto';
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

  @Get('polygon')
  @ApiOperation({
    summary: 'Fetch GeoJSON boundary polygon for an administrative unit',
    description: `
Resolves and returns the GeoJSON boundary polygon for a named administrative unit.

**Administrative Levels supported:**
- \`country\` — National boundary
- \`state\` — State/province boundary
- \`district\` — District boundary
- \`taluk\` — Sub-district/taluk boundary
- \`village\` — Village boundary

**Cache Strategy (two-level):**
1. L1 — In-memory Map (process-scoped, sub-millisecond)
2. L2 — MongoDB GeoBoundaryCache (persistent, shared across restarts)
3. L3 — External geocoding provider (only on full cache miss)

**Example:** \`GET /geoboundary/polygon?adminLevel=district&name=Bengaluru Urban\`
    `.trim(),
  })
  @ApiQuery({ name: 'adminLevel', enum: ['village', 'taluk', 'district', 'state', 'country'], required: true })
  @ApiQuery({ name: 'name', type: String, required: true, example: 'Bengaluru Urban' })
  @ApiResponse({
    status: 200,
    description: 'GeoJSON Feature containing the boundary polygon geometry and properties.',
  })
  @ApiResponse({
    status: 404,
    description: 'Boundary polygon not found for the specified administrative unit.',
  })
  async getBoundaryPolygon(@Query() query: PolygonLookupDto) {
    return this.geoboundaryService.resolveBoundaryPolygon(query.adminLevel, query.name);
  }
}

