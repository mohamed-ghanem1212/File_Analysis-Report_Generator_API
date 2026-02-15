import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import bcrypt from 'bcryptjs';
import { PrismaService } from 'src/db/service/db.service';
import { CreateUserDto } from '../dto/users.dto';
import { User } from '../interface/users.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUser(user: CreateUserDto) {
    const existingUser = await this.getUserByEmail(user.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 8);
    const newUser: User = await this.prisma.user.create({
      data: { ...user, password: hashedPassword },
      include: { projects: true },
    });

    const { password, ...userWithoutPassword } = newUser;
    console.log(newUser);

    return userWithoutPassword;
  }
  async getUserByEmail(email: string) {
    console.log('1. getUserByEmail called with:', email);

    try {
      console.log('2. About to call prisma.user.findFirst...');

      const findUser = await this.prisma.user.findFirst({
        where: { email },
      });

      console.log('3. Query completed. User found:', !!findUser);
      return findUser;
    } catch (error) {
      console.error('❌ Error in getUserByEmail:', error);
      throw error;
    }
  }
  async verifyUser(email: string) {
    const user = await this.getUserByEmail(email);
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
    const findUser = await this.prisma.user.findUnique({
      where: { id },
      include: { projects: true },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    return findUser;
  }
}
