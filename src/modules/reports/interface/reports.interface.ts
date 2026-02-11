import { Prisma } from 'src/db/prisma/src/db/generated/prisma/client';
import {
  Format,
  ReportType,
} from 'src/db/prisma/src/db/generated/prisma/enums';

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
