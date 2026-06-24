import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CropStatus } from '../farmer-crop.entity';

export class UpdateFarmerCropDto {
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

  @IsEnum(CropStatus)
  @IsOptional()
  status?: CropStatus;
}
