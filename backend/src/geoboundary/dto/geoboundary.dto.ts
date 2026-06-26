import { IsNumber, IsNotEmpty } from 'class-validator';
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
