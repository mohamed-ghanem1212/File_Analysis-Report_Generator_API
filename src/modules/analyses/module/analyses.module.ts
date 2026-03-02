import { Module } from '@nestjs/common';
import { AnalysesController } from '../controller/analyses.controller';
import { AnalysesService } from '../service/analyses.service';
import { BullModule } from '@nestjs/bullmq';
import { AnalysisProcessor } from '../analyzers/analysis.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'analysis',
    }),
  ],
  controllers: [AnalysesController],
  providers: [AnalysesService, AnalysisProcessor],
})
export class AnalysisModule {}
