import { PrismaService } from 'src/db/service/db.service';
import { RawIssue } from '../interface/rawIssue.interface';

export async function saveIssues(
  rawIssues: RawIssue[],
  analysisId: string,
  savedFiles: { id: string; filePath: string; fileHash: string }[],
  prisma: PrismaService,
): Promise<void> {
  if (rawIssues.length === 0) return;
  const fileMap = new Map(savedFiles.map((file) => [file.filePath, file.id]));
  const validateIssue = rawIssues
    .map((issue) => ({ issue, fileId: fileMap.get(issue.filePath) }))
    .filter(({ issue, fileId }) => {
      if (!fileId) {
        console.warn(`No file record found for: ${issue.filePath}`);
        return false;
      }
      return true;
    }) as { issue: RawIssue; fileId: string }[];
  if (validateIssue.length === 0) return;
  await prisma.issue.createMany({
    data: validateIssue.map(({ issue, fileId }) => ({
      fileId,
      analysisId,
      title: issue.title,
      description: issue.description,
      lineNumber: issue.lineNumber,
      columnNumber: issue.columnNumber,
      codeSnippet: issue.codeSnippet,
      category: issue.category,
      severity: issue.severity,
      ruleId: issue.ruleId,
      suggestion: issue.suggestion,
    })),
  });

  for (const [filePath, fileId] of fileMap) {
    const count = rawIssues.filter(
      (issue) => issue.filePath === filePath,
    ).length;
    if (count > 0) {
      await prisma.file.update({
        where: { id: fileId },
        data: { issuesFound: count },
      });
    }
  }
}
