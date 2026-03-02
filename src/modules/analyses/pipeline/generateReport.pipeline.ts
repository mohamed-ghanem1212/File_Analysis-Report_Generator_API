import { PrismaService } from 'src/db/service/db.service';

export const generateReport = async (
  analysisId: string,
  userId: string,
  prisma: PrismaService,
): Promise<void> => {
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: {
      files: true,
      issues: true,
      metrics: true,
      project: true,
    },
  });
  if (!analysis) return;
  const content = {
    overview: {
      projectName: analysis.project.name,
      repositoryUrl: analysis.project.repositoryUrl,
      branch: analysis.branch,
      commitHash: analysis.commitHash,
      analyzedAt: analysis.completedAt,
      totalFiles: analysis.totalFiles,
      totalLines: analysis.totalLines,
      issuesFound: analysis.issuesFound,
      complexityScore: analysis.complexityScore,
      summary: analysis.summary,
    },

    issueBreakdown: {
      bySeverity: {
        critical: analysis.issues.filter((i) => i.severity === 'CRITICAL')
          .length,
        high: analysis.issues.filter((i) => i.severity === 'HIGH').length,
        medium: analysis.issues.filter((i) => i.severity === 'MEDIUM').length,
        low: analysis.issues.filter((i) => i.severity === 'LOW').length,
      },
      byCategory: {
        security: analysis.issues.filter((i) => i.category === 'SECURITY')
          .length,
        bugRisk: analysis.issues.filter((i) => i.category === 'BUG_RISK')
          .length,
        performance: analysis.issues.filter((i) => i.category === 'PERFORMANCE')
          .length,
        style: analysis.issues.filter((i) => i.category === 'STYLE').length,
        complexity: analysis.issues.filter((i) => i.category === 'COMPLEXITY')
          .length,
        codeSmell: analysis.issues.filter((i) => i.category === 'CODE_SMELL')
          .length,
      },
    },

    files: analysis.files.map((file) => ({
      fileName: file.fileName,
      filePath: file.filePath,
      linesOfCode: file.linesOfCode,
      issuesFound: file.issuesFound,
      complexityScore: file.complexityScore,
    })),

    issues: analysis.issues.map((issue) => ({
      title: issue.title,
      description: issue.description,
      severity: issue.severity,
      category: issue.category,
      lineNumber: issue.lineNumber,
      columnNumber: issue.columnNumber,
      codeSnippet: issue.codeSnippet,
      suggestion: issue.suggestion,
      isResolved: issue.isResolved,
    })),

    metrics: analysis.metrics.map((metric) => ({
      name: metric.name,
      value: metric.value,
      unit: metric.unit,
      type: metric.type,
      metaData: metric.metaData,
    })),
  };
  await prisma.report.create({
    data: {
      analysisId,
      userId,
      reportType: 'DETAILED',
      format: 'JSON',
      content,
      expiresAt: getExpiryDate(30), // expires in 30 days
    },
  });
};

// report expires 30 days from now
function getExpiryDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
