import { Format, Prisma, ReportType } from '@prisma/client';

export interface Report {
  id?: string;
  analysisId: string;
  userId: string;
  reportType: ReportType;
  format: Format;
  content: Prisma.JsonValue;
  filePath?: string;
  downloadUrl?: string;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
