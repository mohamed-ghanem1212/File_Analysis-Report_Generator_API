import { Prisma } from 'src/db/prisma/src/db/generated/prisma/client';
import { Visibility } from 'src/db/prisma/src/db/generated/prisma/enums';

export interface Project {
  id?: string;
  userId: string;
  name: string;
  repositoryUrl?: string;
  visibility: Visibility;
  createdAt?: Date;
  updatedAt?: Date;
  settings?: Prisma.JsonValue;
}
