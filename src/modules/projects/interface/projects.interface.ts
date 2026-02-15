import { Prisma, Visibility } from '@prisma/client';

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
