import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/service/users.service';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/modules/users/dto/users.dto';
import { User } from 'src/modules/users/interface/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async joinUser(user: CreateUserDto) {
    const newUser = await this.userService.createUser(user);
    if (!newUser) {
      throw new BadRequestException('Something went wrong try again later');
    }
    const payLoad = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    };
    const token = await this.jwtService.signAsync(payLoad);
    console.log(token);

    return { newUser, token };
  }
  async validateUser(email: string, password: string): Promise<any> {
    const userValidator = await this.userService.verifyUser(email);
    const hashedPassword = await bcrypt.compare(
      password,
      userValidator.password,
    );
    if (!hashedPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const generateToken = await this.logIn(userValidator);
    return { userValidator, generateToken };
  }
  async logIn(user: User) {
    const jwtPayLoad = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(jwtPayLoad);
    return token;
  }
}
