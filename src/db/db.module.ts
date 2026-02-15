import { PrismaService } from './service/db.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaService],
})
export class DbModule {}
