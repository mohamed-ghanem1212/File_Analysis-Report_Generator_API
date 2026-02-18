import { Project, Role } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  projects?: Project[];
}
