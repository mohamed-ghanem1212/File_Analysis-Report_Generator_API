import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'src/db/prisma/src/db/generated/prisma/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsString()
  @MinLength(2)
  password: string;
  @IsEnum(Role, {
    message: `Role must be either ${Role.ADMIN} or ${Role.USER}`,
  })
  role: Role;
}
export class VerifyUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsString()
  @MinLength(2)
  password: string;
}
export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
