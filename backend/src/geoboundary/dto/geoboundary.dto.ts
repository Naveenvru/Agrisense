import { IsNumber, IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ReverseGeocodeDto {
  @ApiProperty({ description: 'Latitude of the location', example: 12.9716 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude of the location', example: 77.5946 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  lon: number;
}

/**
 * DTO for the polygon boundary lookup endpoint.
 * Validates that the administrative level is one of the supported tiers.
 */
export class PolygonLookupDto {
  @ApiProperty({
    description: 'The administrative level to look up the boundary polygon for.',
    enum: ['village', 'taluk', 'district', 'state', 'country'],
    example: 'district',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['village', 'taluk', 'district', 'state', 'country'], {
    message: 'adminLevel must be one of: village, taluk, district, state, country',
  })
  adminLevel: 'village' | 'taluk' | 'district' | 'state' | 'country';

  @ApiProperty({
    description: 'The name of the administrative unit to fetch the boundary polygon for.',
    example: 'Bengaluru Urban',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

