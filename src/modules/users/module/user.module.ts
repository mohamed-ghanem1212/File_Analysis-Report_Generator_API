import { UsersController } from '../controller/users.controller';

import { Module } from '@nestjs/common';

import { UsersService } from '../service/users.service';
import { DbModule } from 'src/db/db.module';
import { PrismaService } from 'src/db/service/db.service';

@Module({
  imports: [DbModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UserModule {}
