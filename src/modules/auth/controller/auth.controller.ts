import {
  Body,
  Catch,
  Controller,
  HttpException,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from 'src/modules/users/dto/users.dto';
import { HttpExceptionFilter } from 'src/common/filters/http.exception';
@Controller('auth')
// @UseFilters(new HttpExceptionFilter())
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    const newUser = await this.authService.joinUser(createUserDto);
    console.log(newUser);
    return {
      message: 'User has been created',
      success: true,
      newUser,
    };
  }
}
