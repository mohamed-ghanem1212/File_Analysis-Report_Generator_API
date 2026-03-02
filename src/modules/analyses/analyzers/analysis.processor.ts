import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from 'src/db/service/db.service';
import { JobData } from '../interface/job-data.interface';
import { fetchCode } from '../pipeline/fetch.pipeline';
import { parseFiles } from '../pipeline/parseFiles.pipeline';
import { saveFiles } from '../pipeline/saveFiles.pipeline';
import { detectIssues } from '../pipeline/detectIssues.pipeline';
import { saveIssues } from '../pipeline/saveIssues.pipeline';
import { calculateMetrics } from '../pipeline/calculateMetrics.pipeline';
import { enrichWithAiSuggestion } from '../pipeline/enrich-ai.pipeline';
import { generateSummary } from '../pipeline/generate-summary.pipeline';
import { generateReport } from '../pipeline/generateReport.pipeline';
import { cleanup } from '../pipeline/cleanUp.pipeline';
import { BadRequestError } from 'openai';
@Processor('analysis')
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }
  async process(job: Job<JobData>): Promise<void> {
    const { analysisId, userId, projectId, repositoryUrl, branch } = job.data;
    this.logger.log(`starting analysis ${analysisId}`);
    try {
      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'IN_PROGRESS',
        },
      });
      // stage 1
      this.logger.log(`[${analysisId}] Stage 1: Fetching code...`);
      const { clonePath, commitHash } = await fetchCode(
        repositoryUrl,
        branch,
        analysisId,
      );
      // stage 2
      this.logger.log(`[${analysisId}] Stage 2: Parsing files...`);
      const parseFile = await parseFiles(clonePath);

      // stage 3
      this.logger.log(`[${analysisId}] Stage 3: Saving files...`);
      const savedFiles = await saveFiles(parseFile, analysisId, this.prisma);

      // stage 4
      this.logger.log(`[${analysisId}] Stage 4: Detecting issues...`);
      const rawIssues = await detectIssues(parseFile);

      // stage 5
      this.logger.log(`[${analysisId}] Stage 5: Saving issues...`);
      await saveIssues(rawIssues, analysisId, savedFiles, this.prisma);

      // stage 6
      this.logger.log(`[${analysisId}] Stage 6: Calculating metrics...`);
      await calculateMetrics(
        parseFile,
        rawIssues,
        analysisId,
        projectId,
        this.prisma,
      );
      // stage 7
      this.logger.log(`[${analysisId}] Stage 7: Enriching with AI...`);
      await enrichWithAiSuggestion(analysisId, this.prisma);
      // stage 8
      this.logger.log(`[${analysisId}] Stage 8: Generating summary...`);
      await generateSummary(analysisId, this.prisma);
      // stage 9
      this.logger.log(`[${analysisId}] Stage 9: Generating summary...`);
      await generateReport(analysisId, userId, this.prisma);

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          commitHash,
          totalFiles: parseFile.length,
          totalLines: parseFile.reduce((sum, f) => sum + f.linesOfCode, 0),
          issuesFound: rawIssues.length,
          complexityScore:
            parseFile.length > 0
              ? parseFile.reduce((sum, f) => sum + f.complexityScore, 0)
              : 0,
        },
      });
      this.logger.log(`[${analysisId}] Analysis completed successfully`);
    } catch (err) {
      this.logger.error(`[${analysisId}] Analysis failed: ${err.message}`);

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'FAILED' },
      });
      throw new BadRequestException(
        `Something wrong has happened while analyzing... ${err}`,
      );
    } finally {
      // always runs — success or failure
      this.logger.log(`[${analysisId}] Stage 10: Cleaning up...`);
      await cleanup(analysisId);
    }
  }
}
