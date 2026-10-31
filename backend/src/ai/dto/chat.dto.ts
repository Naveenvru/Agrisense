import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

export class AiHistoryMessageDto {
  @IsIn(['user', 'assistant', 'model'])
  role: 'user' | 'assistant' | 'model';

  @IsString()
  @MaxLength(3000)
  content: string;
}

export class AiChatDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  prompt: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AiHistoryMessageDto)
  history?: AiHistoryMessageDto[];
}
