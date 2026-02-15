import { AnalysisStatus, Prisma, TriggerType } from '@prisma/client';

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
