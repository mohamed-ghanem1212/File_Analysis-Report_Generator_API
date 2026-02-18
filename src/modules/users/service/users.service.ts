import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import bcrypt from 'bcryptjs';
import { PrismaService } from 'src/db/service/db.service';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { User } from '../interface/users.interface';
import { AuthUser } from 'src/common/decorators/user.decorator';

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
  async findUserById(id: string): Promise<any> {
    if (!id) {
      throw new BadRequestException('essential data needed');
    }
    const findUser = await this.prisma.user.findUnique({
      where: { id: id },
      include: { projects: true },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    const { password, ...user } = findUser;
    return user;
  }
  async getAllUsers(): Promise<any> {
    const AllUsers = await this.prisma.user.findMany();
    if (AllUsers.length === 0) {
      throw new BadRequestException("Users' list is empty");
    }
    const users = AllUsers.map((user: User) => {
      const { password, ...users } = user;
      return users;
    });
    return users;
  }
  async updateUser(user: UpdateUserDto, id: string): Promise<any> {
    console.log(`user____ ${user}`);

    if (!id) {
      throw new BadRequestException("Need user's ID");
    }
    const findUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }
    const userUpdator = await this.prisma.user.update({
      data: {
        username: user.username,
        email: user.email,
        isActive: user.isActive,
      },
      where: { id },
    });
    const { password, ...saveUser } = userUpdator;
    return saveUser;
  }
  async fetchUserByToken(user: AuthUser) {
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
