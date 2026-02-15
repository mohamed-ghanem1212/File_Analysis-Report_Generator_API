import { Category, Prisma, Severity } from '@prisma/client';

export interface Rule {
  id?: string;
  ruleId: string;
  name: string;
  description: string;
  severity: Severity;
  category: Category;
  isActive: boolean;
  config: Prisma.JsonValue;
  language: string;
}
