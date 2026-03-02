import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TriggerType } from '@prisma/client';

export class TriggerAnalysisDto {
  @ApiPropertyOptional({
    enum: TriggerType,
    default: TriggerType.MANUAL,
    description: 'What triggered this analysis',
  })
  @IsEnum(TriggerType)
  @IsOptional()
  trigger?: TriggerType = TriggerType.MANUAL;
}
