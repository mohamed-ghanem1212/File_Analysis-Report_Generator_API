import { Prisma } from 'src/db/prisma/src/db/generated/prisma/client';
import {
  AnalysisStatus,
  TriggerType,
} from 'src/db/prisma/src/db/generated/prisma/enums';

export interface Analysis {
  id?: string;
  projectId: string;
  userId: string;
  status: AnalysisStatus;
  triggerType: TriggerType;
  summary: Prisma.JsonValue;
  totalFiles: number;
  totalLines: number;
  issuesFound: number;
  complexityScore: number;
  createdAt?: Date;
  completedAt?: Date;
}
