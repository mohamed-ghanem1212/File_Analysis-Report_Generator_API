import * as fs from 'fs-extra';

export const extractCodeSnippet = async (
  filePath: string,
  lineNumber: number,
  contextLines: number = 3,
): Promise<string> => {
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');
  const start = Math.max(0, lineNumber - contextLines - 1);
  const end = Math.min(lines.length, lineNumber + contextLines);

  return lines
    .slice(start, end)
    .map((line, index) => {
      const currentLine = start + index + 1;
      const marker = currentLine === lineNumber ? '→' : '  ';
      return `${marker} ${currentLine}: ${line}`;
    })
    .join('\n');
};
