import { IsString, MaxLength, MinLength } from 'class-validator';

export class DecisionQueryDto {
  @IsString() @MinLength(3) @MaxLength(500) query: string;
}
