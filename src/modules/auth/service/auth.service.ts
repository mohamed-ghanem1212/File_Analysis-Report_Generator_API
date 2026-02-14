import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/service/users.service';
import bcrypt from 'node_modules/bcryptjs';
import { User } from 'src/modules/users/interface/users.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async joinUser(user: User) {
    const newUser = await this.userService.createUser(user);
    if (!newUser) {
      throw new BadRequestException('Something went wrong try again later');
    }
    const token = this.jwtService.sign(user);
    return { newUser, token };
  }
  async validateUser(email: string, password: string): Promise<any> {
    const userValidator = await this.userService.verifyUser(email);
    const hashedPassword = bcrypt.compare(password, userValidator.password);
    if (!hashedPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const generateToken = this.logIn(userValidator);
    return { userValidator, generateToken };
  }
  async logIn(user: User) {
    const jwtPayLoad = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = this.jwtService.sign(jwtPayLoad);
    return token;
  }
}
