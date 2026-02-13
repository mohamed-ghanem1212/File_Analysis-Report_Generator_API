import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../interface/users.interface';
import { prisma } from 'src/db/prisma.client';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async createUser(user: User) {
    const existingUser = await this.getUserByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 8);
    const newUser: User = await prisma.user.create({
      data: { ...user, password: hashedPassword },
      include: { projects: true },
    });

    const { password, ...userWithoutPassword } = newUser;

    return { ...userWithoutPassword };
  }
  async getUserByEmail(email: string) {
    const findUser = await prisma.user.findUnique({ where: { email } });
    return findUser;
  }
  async verifyUser(email: string) {
    const user: User = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
  async findUserById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('essential data needed');
    }
    const findUser: User = await prisma.user.findFirst({
      where: { id },
      include: { projects: true },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    return findUser;
  }
}
