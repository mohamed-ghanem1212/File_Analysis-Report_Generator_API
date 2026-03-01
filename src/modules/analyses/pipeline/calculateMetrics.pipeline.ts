import { PrismaService } from 'src/db/service/db.service';
import { ParsedFile } from '../interface/parsedFiles.interface';
import { RawIssue } from '../interface/rawIssue.interface';
import { Prisma } from '@prisma/client';

export const calculateMetrics = async (
  parsedFiles: ParsedFile[],
  rawIssues: RawIssue[],
  analysisId: string,
  projectId: string,
  prisma: PrismaService,
): Promise<void> => {
  const metrics: Prisma.MetricCreateManyInput[] = [];

  const totalComplexity = parsedFiles.reduce(
    (sum, file) => sum + file.complexityScore,
    0,
  );
  const averageComplexity =
    parsedFiles.length > 0 ? totalComplexity / parsedFiles.length : 0;
  metrics.push({
    analysisId,
    projectId,
    name: 'Average Complexity',
    value: parseFloat(averageComplexity.toFixed(2)),
    unit: 'score',
    type: 'COMPLEXITY',
    metaData: {
      totalFiles: parsedFiles.length,
      totalComplexity,
      highComplexityFiles: parsedFiles.filter((f) => f.complexityScore > 10)
        .length,
    },
  });
  const securityIssues = rawIssues.filter(
    (issue) => issue.category === 'SECURITY',
  );
  metrics.push({
    analysisId,
    projectId,
    name: 'Security Vulnerabilities',
    value: securityIssues.length,
    unit: 'issues',
    type: 'SECURITY_VULNERABILITIES',
    metaData: {
      critical: securityIssues.filter((i) => i.severity === 'CRITICAL').length,
      high: securityIssues.filter((i) => i.severity === 'HIGH').length,
      medium: securityIssues.filter((i) => i.severity === 'MEDIUM').length,
      low: securityIssues.filter((i) => i.severity === 'LOW').length,
    },
  });
  const styleIssues = rawIssues.filter((issue) => issue.category === 'STYLE');
  metrics.push({
    analysisId,
    projectId,
    name: 'Style Violations',
    value: styleIssues.length,
    unit: 'issues',
    type: 'STYLE_VIOLATIONS',
    metaData: {
      perFile: parseFloat(
        (styleIssues.length / (parsedFiles.length || 1)).toFixed(2),
      ),
      mostCommonRule: getMostCommonRule(styleIssues),
    },
  });
  const debtIssues = rawIssues.filter(
    (issue) =>
      issue.category === 'TECHNICAL_DEBT' ||
      issue.category === 'CODE_SMELL' ||
      issue.category === 'COMPLEXITY',
  );

  // estimate debt in minutes — each issue costs roughly 30 mins to fix
  const debtMinutes = debtIssues.length * 30;

  metrics.push({
    analysisId,
    projectId,
    name: 'Technical Debt',
    value: debtMinutes,
    unit: 'minutes',
    type: 'TECHNICAL_DEBT',
    metaData: {
      totalIssues: debtIssues.length,
      estimatedHours: parseFloat((debtMinutes / 60).toFixed(2)),
      breakdown: {
        codeSmells: rawIssues.filter((i) => i.category === 'CODE_SMELL').length,
        complexity: rawIssues.filter((i) => i.category === 'COMPLEXITY').length,
        technicalDebt: rawIssues.filter((i) => i.category === 'TECHNICAL_DEBT')
          .length,
      },
    },
  });
  metrics.push({
    analysisId,
    projectId,
    name: 'Issues Breakdown',
    value: rawIssues.length,
    unit: 'issues',
    type: 'TECHNICAL_DEBT',
    metaData: {
      bySeverity: {
        critical: rawIssues.filter((i) => i.severity === 'CRITICAL').length,
        high: rawIssues.filter((i) => i.severity === 'HIGH').length,
        medium: rawIssues.filter((i) => i.severity === 'MEDIUM').length,
        low: rawIssues.filter((i) => i.severity === 'LOW').length,
      },
      byCategory: {
        security: rawIssues.filter((i) => i.category === 'SECURITY').length,
        bugRisk: rawIssues.filter((i) => i.category === 'BUG_RISK').length,
        performance: rawIssues.filter((i) => i.category === 'PERFORMANCE')
          .length,
        style: rawIssues.filter((i) => i.category === 'STYLE').length,
        complexity: rawIssues.filter((i) => i.category === 'COMPLEXITY').length,
        codeSmell: rawIssues.filter((i) => i.category === 'CODE_SMELL').length,
      },
    },
  });

  // save all metrics in one DB call
  await prisma.metric.createMany({ data: metrics });

  function getMostCommonRule(issues: RawIssue[]): string {
    if (issues.length === 0) return 'none';

    const ruleCounts = issues.reduce(
      (acc, issue) => {
        acc[issue.ruleId] = (acc[issue.ruleId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return (
      Object.entries(ruleCounts)
        .sort(([, a], [, b]) => b - a)
        .at(0)?.[0] ?? 'none'
    );
  }
};
