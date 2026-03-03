import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AnalysesService } from '../service/analyses.service';
import { TriggerAnalysisDto } from '../dto/analyses.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { AuthUser } from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/filters/http.exception';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
@ApiTags('Analysis') // ← groups all endpoints under "Analysis"
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/analysis')
@UseFilters(new HttpExceptionFilter())
export class AnalysesController {
  constructor(private readonly analysisService: AnalysesService) {}

  @Post()
  @ApiOperation({ summary: 'analysis trigger' })
  @ApiParam({ name: 'projectId', type: 'string' })
  async trigger(
    @Param('projectId') projectId: string,
    @Body() dto: TriggerAnalysisDto,
    @CurrentUser() user: AuthUser,
  ) {
    const userId = user.id;
    return await this.analysisService.trigger(projectId, userId, dto);
  }

  @Get()
  @ApiParam({ name: 'projectId', type: 'string' })
  async getAll(@Param('projectId') projectId: string) {
    return this.analysisService.getAll(projectId);
  }

  @Get(':analysisId')
  @ApiParam({ name: 'projectId', type: 'string' })
  @ApiParam({ name: 'analysisId', type: 'string' })
  async getStatus(
    @Param('projectId') projectId: string,
    @Param('analysisId') analysisId: string,
  ) {
    return await this.analysisService.getStatus(projectId, analysisId);
  }
}
