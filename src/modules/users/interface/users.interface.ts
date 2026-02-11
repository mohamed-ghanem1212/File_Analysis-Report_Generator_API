import { ProjectCreateNestedManyWithoutUserInput } from 'src/db/prisma/src/db/generated/prisma/models';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export interface User {
  id?: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  projects?: ProjectCreateNestedManyWithoutUserInput;
}
