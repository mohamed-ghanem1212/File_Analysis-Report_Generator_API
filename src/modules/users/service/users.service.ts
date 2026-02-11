import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '../interface/users.interface';
import { prisma } from 'src/db/prisma.client';
import bcrypt from 'node_modules/bcryptjs';
import jwt from 'jsonwebtoken';
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
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );
    const { password, ...userWithoutPassword } = newUser;
    return { ...userWithoutPassword, token };
  }
  async getUserByEmail(email: string) {
    const findUser = await prisma.user.findUnique({ where: { email } });
    return findUser;
  }
  async verifyUser(email: string, password: string) {
    const user: User = await this.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    );
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }
}
