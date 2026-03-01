import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import { glob } from 'glob';
import { ParsedFile } from '../interface/parsedFiles.interface';

export const parseFiles = async (clonePath: string): Promise<ParsedFile[]> => {
  const filePaths = await glob('**/*.{js,ts,jsx,tsx}', {
    cwd: clonePath,
    absolute: true,
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*.test.ts',
      '**/*.spec.ts',
    ],
  });
  const parsedFiles: ParsedFile[] = [];
  for (const filePath of filePaths) {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    let lineOfCodes = 0;
    let lineBlank = 0;
    let lineOfComments = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '') {
        lineBlank++;
      } else if (
        trimmed.startsWith('//') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('*')
      ) {
        lineOfComments++;
      } else {
        lineOfCodes++;
      }
    }
    const fileHash = crypto.createHash('md5').update(content).digest('hex');
    parsedFiles.push({
      lineBlank,
      linesOfCode: lineOfCodes,
      lineComment: lineOfComments,
      fileExtension: path.extname(filePath).replace('.', ''),
      filePath,
      fileName: path.basename(filePath),
      fileHash,
    });
  }
  return parsedFiles;
};
