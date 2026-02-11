import { Prisma } from 'src/db/prisma/src/db/generated/prisma/client';
import {
  Category,
  Severity,
} from 'src/db/prisma/src/db/generated/prisma/enums';

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
