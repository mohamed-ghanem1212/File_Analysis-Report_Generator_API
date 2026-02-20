import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/users.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import type { AuthUser } from 'src/common/decorators/user.decorator';
import { HttpExceptionFilter } from 'src/common/filters/http.exception';

@Controller('users')
@UseFilters(new HttpExceptionFilter())
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/getUser/:id')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiOperation({ summary: 'get user by his ID' })
  async getUserById(@Param('id') id: string) {
    const findUser = await this.userService.findUserById(id);
    return findUser;
  }
  @Get('/getAllUsers')
  @ApiOperation({ summary: 'Get all users' }) // ✅ Description
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      example: [
        {
          id: 1,
          email: 'john@example.com',
          username: 'johndoe',
          role: 'user',
          createdAt: '2026-02-16T10:00:00.000Z',
          updatedAt: '2026-02-16T10:00:00.000Z',
        },
        {
          id: 2,
          email: 'jane@example.com',
          username: 'janedoe',
          role: 'admin',
          createdAt: '2026-02-16T11:00:00.000Z',
          updatedAt: '2026-02-16T11:00:00.000Z',
        },
      ],
    },
  })
  async getAllUsers() {
    const getUsers = await this.userService.getAllUsers();
    return {
      message: 'Users found',
      success: true,
      getUsers,
    };
  }

  @Patch('/updateUser')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User Details' })
  @ApiBody({ type: UpdateUserDto })
  async updateUserData(
    @CurrentUser() userData: AuthUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const newUser = await this.userService.updateUser(
      updateUserDto,
      userData.id,
    );
    return {
      message: 'User has been updated',
      success: true,
      newUser,
    };
  }
  @Get('/getUserByToken')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  async getUserByToken(@CurrentUser() user: AuthUser) {
    console.log(user);
    const User = await this.userService.fetchUserByToken(user.id);
    return {
      message: 'User found',
      success: true,
      User,
    };
  }
  @Delete('/removeUser/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', type: 'string' })
  async deleteUserById(@Param('id') id: string) {
    const removeUser = await this.userService.removeUser(id);
    return {
      message: 'User has been removed',
      success: true,
      removeUser,
    };
  }
}
