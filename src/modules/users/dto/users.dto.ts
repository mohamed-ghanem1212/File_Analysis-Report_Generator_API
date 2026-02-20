import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Enter a valid email',
    example: 'mohamed.maah@example.com',
  })
  @IsEmail()
  @Matches(/^[A-Za-z0-9._%+-]+@(gmail|yahoo|outlook)\.(com)$/, {
    message: 'Email must be gmail.com, yahoo.com, or outlook.com',
  })
  email: string;
  @ApiProperty({ description: 'Enter a username' })
  @IsString()
  username: string;
  @ApiProperty({
    description: 'Enter a proper password for you safety',
    example: 'ZMKSNDKNKD&^&DS',
  })
  @IsString()
  @MinLength(2)
  password: string;
  @ApiProperty({
    enum: Role,
    enumName: 'Role',
    required: false,
    description: 'USER or ADMIN',
  })
  @IsEnum(Role, {
    message: `Role must be either ${Role.ADMIN} or ${Role.USER}`,
  })
  @IsOptional()
  role?: Role;
}
export class VerifyUserDto {
  @ApiProperty({
    description: 'Enter a valid email',
    example: 'mohamed.maah@example.com',
  })
  @Matches(/^[A-Za-z0-9._%+-]+@(gmail|yahoo|outlook)\.(com)$/, {
    message: 'Email must be gmail.com, yahoo.com, or outlook.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'Enter your password to sign in' })
  @IsString()
  @MinLength(2)
  password: string;
}
export class UpdateUserDto {
  @ApiProperty({
    description: 'Enter a valid email',
    example: 'mohamed.maah@example.com',
  })
  @Matches(/^[A-Za-z0-9._%+-]+@(gmail|yahoo|outlook)\.(com)$/, {
    message: 'Email must be gmail.com, yahoo.com, or outlook.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string;
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
