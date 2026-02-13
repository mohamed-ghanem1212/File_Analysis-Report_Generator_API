import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/interface/users.interface';
import { UsersService } from 'src/modules/users/service/users.service';
import bcrypt from 'node_modules/bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const userValidator = await this.userService.verifyUser(email);
    const hashedPassword = bcrypt.compare(password, userValidator.password);
    if (!hashedPassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payLoad = {
      userId: userValidator.id,
      email: userValidator.email,
      username: userValidator.username,
      role: userValidator.role,
    };
    const token = this.jwtService.sign(payLoad);
    return { userValidator, token };
  }
}
