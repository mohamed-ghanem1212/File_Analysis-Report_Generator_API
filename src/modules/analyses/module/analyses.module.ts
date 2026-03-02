import { Module } from '@nestjs/common';
import { AnalysesController } from '../controller/analyses.controller';
import { AnalysesService } from '../service/analyses.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analysis',
    }),
  ],
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysisModule {}
