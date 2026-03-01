export type IssueCategory =
  | 'CODE_SMELL'
  | 'BUG_RISK'
  | 'PERFORMANCE'
  | 'SECURITY'
  | 'STYLE'
  | 'COMPLEXITY'
  | 'DUPLICATION'
  | 'TECHNICAL_DEBT';

export interface RawIssue {
  filePath: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: IssueCategory;
  ruleId: string;
  codeSnippet: string;
  suggestion: string;
}
