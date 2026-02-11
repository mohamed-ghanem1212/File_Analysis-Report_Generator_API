import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '../interface/users.interface';
import { prisma } from 'src/db/prisma.client';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async createUser(user: User) {
    const existingUser = await this.getUserByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const newUser = await prisma.user.create({ data: user });
    return newUser;
  }
  async getUserByEmail(email: string) {
    const findUser = await prisma.user.findUnique({ where: { email } });
    return findUser;
  }
}
