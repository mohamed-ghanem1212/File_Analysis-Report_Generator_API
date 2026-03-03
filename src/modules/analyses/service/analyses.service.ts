import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from 'src/db/service/db.service';
import { TriggerAnalysisDto } from '../dto/analyses.dto';

@Injectable()
export class AnalysesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('analysis') private readonly analysisQueue: Queue,
  ) {}
  async trigger(projectId: string, userId: string, data: TriggerAnalysisDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (!project.repositoryUrl) {
      throw new BadRequestException('Repository Url needed');
    }

    const analysis = await this.prisma.analysis.create({
      data: {
        projectId,
        userId,
        status: 'PENDING',
        trigger: data.trigger,
        branch: project.branch,
        summary: {},
        totalFiles: 0,
        totalLines: 0,
        issuesFound: 0,
        complexityScore: 0,
      },
    });
    await this.analysisQueue.add('analysis', {
      analysisId: analysis.id,
      projectId,
      userId,
      repositoryUrl: project.repositoryUrl,
      branch: project.branch,
    });
    return {
      analysis: analysis,
      status: analysis.status,
      message: 'Analysis started successfully',
    };
  }
  async getStatus(projectId: string, analysisId: string) {
    if (!analysisId) {
      throw new BadRequestException('no id provided');
    }
    const analysis = await this.prisma.analysis.findUnique({
      where: { id: analysisId, projectId },
      include: {
        files: true,
        issues: true,
        metrics: true,
        reports: true,
      },
    });
    if (!analysis) {
      throw new NotFoundException('analysis not found');
    }
    return analysis;
  }
  async getAll(projectId: string) {
    if (!projectId) {
      throw new BadRequestException('no id provided');
    }
    const fetchAll = await this.prisma.analysis.findMany({
      where: { projectId },
      orderBy: { startedAt: 'desc' },
    });
    return fetchAll;
  }
}
