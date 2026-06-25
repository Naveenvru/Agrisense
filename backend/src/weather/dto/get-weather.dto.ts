import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetWeatherHistoryDto {
  @ApiPropertyOptional({
    description: 'Start date for history range (ISO 8601)',
    example: '2024-06-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for history range (ISO 8601)',
    example: '2024-06-25T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
