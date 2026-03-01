export interface ParsedFile {
  filePath: string;
  fileName: string;
  fileExtension: string;
  fileHash: string;
  linesOfCode: number;
  lineBlank: number;
  lineComment: number;
}
