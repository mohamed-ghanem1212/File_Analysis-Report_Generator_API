import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  username: string;
  @ApiProperty()
  @IsString()
  @MinLength(2)
  password: string;
  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    required: false,
  })
  @IsEnum(Role, {
    message: `Role must be either ${Role.ADMIN} or ${Role.USER}`,
  })
  @IsOptional()
  role?: Role;
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
