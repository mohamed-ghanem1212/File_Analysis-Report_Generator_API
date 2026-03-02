import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from 'src/db/service/db.service';
import { ReportsService } from '../service/reports.service';
import { ApiParam } from '@nestjs/swagger';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get(':reportId')
  @ApiParam({ name: 'reportId', type: 'string' })
  async fetchReportById(@Param('reportId') reportId: string) {
    const report = await this.reportService.getReportById(reportId);
    return { message: 'report fetched', success: true, report };
  }
}
