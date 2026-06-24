import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFarmerCropDto {
  @IsString()
  @IsNotEmpty()
  parcelId: string;

  @IsString()
  @IsNotEmpty()
  cropId: string;

  @IsString()
  @IsOptional()
  cropVariety?: string;

  @IsDateString()
  @IsOptional()
  sowingDate?: string;

  @IsDateString()
  @IsOptional()
  expectedHarvestDate?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsOptional()
  estimatedYieldKg?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsOptional()
  actualYieldKg?: number;
}
