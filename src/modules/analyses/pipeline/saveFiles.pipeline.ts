import { PrismaService } from 'src/db/service/db.service';
import { ParsedFile } from '../interface/parsedFiles.interface';

export const saveFiles = async (
  parsedFiles: ParsedFile[],
  analysisId: string,
  prisma: PrismaService,
): Promise<{ id: string; filePath: string; fileHash: string }[]> => {
  await prisma.file.createMany({
    data: parsedFiles.map((file: ParsedFile) => ({
      analysisId,
      filePath: file.filePath,
      fileName: file.fileName,
      fileExtension: file.fileExtension,
      fileHash: file.fileHash,
      linesOfCode: file.linesOfCode,
      lineBlank: file.lineBlank,
      lineComment: file.lineComment,
      issuesFound: 0,
      complexityScore: 0,
    })),
  });
  const savedFiles = await prisma.file.findMany({
    where: { analysisId },
    select: { id: true, filePath: true, fileHash: true },
  });
  return savedFiles;
};
