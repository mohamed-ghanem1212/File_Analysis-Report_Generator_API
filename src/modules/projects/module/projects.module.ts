import { Module } from '@nestjs/common';
import { ProjectsService } from '../service/projects.service';
import { ProjectsController } from '../controller/projects.controller';
import { PrismaService } from 'src/db/service/db.service';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectModule {}
