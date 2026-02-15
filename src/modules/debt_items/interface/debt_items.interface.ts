import { Severity, Status } from '@prisma/client';

export interface Debt_Item {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  issueId: string;
  priority: Severity;
  status: Status;
  estimatedEffort: number;
  businessImpact: number;
  assigneeId?: string;
  dueDate?: Date;
}
