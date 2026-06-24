import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(UserRole, { message: 'Role must be farmer, buyer, or admin' })
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsOptional()
  preferredLanguage?: string;
}
