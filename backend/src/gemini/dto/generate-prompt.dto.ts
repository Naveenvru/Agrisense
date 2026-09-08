import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray } from 'class-validator';

export class GeneratePromptDto {
  @IsString()
  @IsNotEmpty({ message: 'Prompt must not be empty' })
  @MaxLength(2000, { message: 'Prompt must not exceed 2000 characters' })
  prompt: string;

  @IsOptional()
  @IsArray()
  history?: Array<{ role: 'user' | 'model'; content: string }>;
}
