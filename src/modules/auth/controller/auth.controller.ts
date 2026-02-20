import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto, VerifyUserDto } from 'src/modules/users/dto/users.dto';
import { HttpExceptionFilter } from 'src/common/filters/http.exception';

import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { LocalAuthGuard } from 'src/common/guards/localAuth.guard';
import type { User } from 'src/modules/users/interface/users.interface';
@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/createUser')
  @ApiOperation({ summary: 'create new user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    const { newUser, token } = await this.authService.joinUser(createUserDto);
    console.log(newUser);
    return {
      message: 'User has been created',
      success: true,
      newUser,
      token,
    };
  }
  @UseGuards(LocalAuthGuard)
  @Post('/logInUser')
  @ApiBody({ type: VerifyUserDto })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async logInUser(@CurrentUser() userData: User) {
    console.log(`controller ${JSON.stringify(userData)}`);

    const { user, token } = await this.authService.logIn(userData);
    return {
      message: 'User has been verified',
      success: true,
      user,
      token,
    };
  }
}
