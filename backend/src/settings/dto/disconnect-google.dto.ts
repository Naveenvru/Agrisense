import { IsString, MinLength } from 'class-validator';

export class DisconnectGoogleDto {
  @IsString()
  @MinLength(1)
  currentPassword: string;
}
