import { IsString, IsNotEmpty, IsObject, IsOptional, MaxLength } from 'class-validator';

export class ExplainContextDto {
  @IsString()
  @IsNotEmpty({ message: 'Topic or action title is required' })
  title: string;

  @IsObject()
  @IsNotEmpty({ message: 'Structured context data must be an object' })
  contextData: Record<string, any>;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  customQuery?: string;
}
