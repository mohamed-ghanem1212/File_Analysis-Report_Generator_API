import { Controller, Get, Param, Res } from '@nestjs/common';
import { PrismaService } from 'src/db/service/db.service';
import { ReportsService } from '../service/reports.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import express from 'express';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get report as JSON' })
  async getReport(@Param('analysisId') analysisId: string) {
    return this.reportService.getReport(analysisId);
  }

  @Get('download')
  @ApiOperation({ summary: 'Download report as PDF' })
  async downloadPdf(
    @Param('analysisId') analysisId: string,
    @Res() res: express.Response,
  ) {
    const pdfBuffer = await this.reportService.downloadPdf(analysisId);

    // set headers so browser downloads the file
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="report-${analysisId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
