import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Language, Visibility } from '@prisma/client';
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
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsUrl()
  repositoryUrl: string;
  @ApiProperty({
    enumName: 'Visibility',
    enum: Visibility,
    required: false,
    description: 'PUBLIC or Private',
  })
  @ApiProperty()
  @IsEnum(Language)
  language: Language;
  @ApiProperty({ example: 'main' })
  @IsString()
  branch: string;
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
  @IsEnum(Visibility, {
    message: 'must be PUBLIC or PRIVATE',
  })
  visibility: Visibility;
  @ApiProperty()
  @IsObject()
  @IsOptional()
  settings: Record<string, any>;
}
