import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/service/db.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReportById(id: string) {
    if (!id) {
      throw new BadRequestException('please provide an ID');
    }
    const report = await this.prisma.report.findUnique({
      where: { id },
    });
    if (!report) {
      throw new BadRequestException('report not found');
    }
  }
}
