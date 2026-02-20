import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import {
  IsString,
  IsJSON,
  IsUUID,
  IsUrl,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';

export class CreateProjectDTO {
  @ApiHideProperty()
  @IsUUID()
  userId: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  repositoryUrl: string;
  @ApiProperty({
    enumName: 'Visibility',
    enum: Visibility,
    description: 'PUBLIC or Private',
  })
  @IsEnum(Visibility, {
    message: 'must be PUBLIC or PRIVATE',
  })
  visibility: Visibility;
  @ApiProperty()
  @IsObject()
  @IsOptional()
  settings: Record<string, any>;
}
export class UpdateProjectDTO {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsOptional()
  @IsUrl()
  @IsEnum(Visibility, {
    message: 'must be PUBLIC or PRIVATE',
  })
  visibility: Visibility;
  @ApiProperty()
  @IsObject()
  @IsOptional()
  settings: Record<string, any>;
}
