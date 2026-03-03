import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/service/db.service';
import { generatePdfFromReport } from '../generators/pdf.generator';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReport(analysisId: string) {
    const report = await this.prisma.report.findFirst({
      where: { analysisId },
    });

    if (!report) throw new NotFoundException('Report not found');

    return report;
  }

  async downloadPdf(analysisId: string): Promise<Buffer> {
    const report = await this.prisma.report.findFirst({
      where: { analysisId },
    });

    if (!report) throw new NotFoundException('Report not found');

    const pdfBuffer = await generatePdfFromReport(report);
    return pdfBuffer;
  }
}
