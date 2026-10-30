import { IsBoolean, IsIn, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsIn(['system', 'light', 'dark'])
  theme?: 'system' | 'light' | 'dark';

  @IsOptional()
  @IsIn(['farm', 'ocean', 'sunrise'])
  accentTheme?: 'farm' | 'ocean' | 'sunrise';

  @IsOptional()
  @IsIn(['metric', 'imperial'])
  units?: 'metric' | 'imperial';

  @IsOptional()
  @IsIn(['en', 'hi', 'kn', 'ta', 'te', 'ml', 'mr', 'bn', 'gu', 'pa', 'or', 'as', 'ur'])
  language?: string;

  @IsOptional()
  @IsBoolean()
  aiAssistanceEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  personalizedRecommendationsEnabled?: boolean;
}
