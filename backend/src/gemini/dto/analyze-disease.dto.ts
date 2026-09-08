import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyzeDiseaseDto {
  @ApiProperty({ description: 'Base64 encoded image string' })
  @IsString()
  @IsNotEmpty()
  imageBase64: string;

  @ApiPropertyOptional({ description: 'MIME type of the image', example: 'image/jpeg' })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @ApiPropertyOptional({ description: 'Crop name / variety hint', example: 'Tomato' })
  @IsString()
  @IsOptional()
  cropName?: string;

  @ApiPropertyOptional({ description: 'Additional symptoms or notes', example: 'Yellowing leaves with dark brown spots' })
  @IsString()
  @IsOptional()
  notes?: string;
}
