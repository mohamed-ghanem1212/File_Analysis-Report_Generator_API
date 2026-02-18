import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super();
  }
  async onModuleInit() {
    try {
      this.logger.log('Connecting to database...');
      await this.$connect();
      this.logger.log('✅ Connected successfully');

      const result = await this.$queryRaw`SELECT current_database()`;
      this.logger.log('Database:', result);
    } catch (error) {
      this.logger.error('❌ Connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
