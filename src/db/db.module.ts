import { PrismaService } from './service/db.service';
import { Global, Module } from '@nestjs/common';
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DbModule {}
