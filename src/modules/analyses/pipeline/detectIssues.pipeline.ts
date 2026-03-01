import { ESLint } from 'eslint';
import { ParsedFile } from '../interface/parsedFiles.interface';
import { RawIssue } from '../interface/rawIssue.interface';
import { mapSeverity } from '../helpers/severity.helper';
import { mapCategory } from '../helpers/category.helper';
import { extractCodeSnippet } from '../helpers/code-snippet.helper';
export const detectIssues = async (
  parsedFiles: ParsedFile[],
): Promise<RawIssue[]> => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: {
      languageOptions: {
        ecmaVersion: 'latest',
        sourceTyoe: 'module',
      },
      rules: {
        // Bug risks
        'no-undef': 'error',
        'no-unreachable': 'error',
        eqeqeq: 'error',
        'no-dupe-keys': 'error',

        // Security
        'no-eval': 'error',
        'no-implied-eval': 'error',
        'no-new-func': 'error',

        // Complexity
        complexity: ['warn', { max: 10 }],
        'max-depth': ['warn', { max: 4 }],

        // Style
        'no-console': 'warn',
        'no-unused-vars': 'warn',

        // Performance
        'no-await-in-loop': 'warn',
      },
    },
  });
  const rawIssues: RawIssue[] = [];
  for (const file of parsedFiles) {
    try {
      const results = await eslint.lintFiles([file.filePath]);
      for (const result of results) {
        for (const msg of result.messages) {
          if (!msg.ruleId) continue;
          const codeSnippet = await extractCodeSnippet(file.filePath, msg.line);
          rawIssues.push({
            filePath: file.filePath,
            fileName: file.fileName,
            lineNumber: msg.line,
            columnNumber: msg.column,
            title: msg.message,
            description: `ESLint rule '${msg.ruleId}' violation`,
            severity: mapSeverity(msg.severity),
            category: mapCategory(msg.ruleId),
            ruleId: msg.ruleId,
            codeSnippet: codeSnippet,
            suggestion: '',
          });
        }
      }
    } catch (err) {
      console.error(`Failed to lint ${file.fileName}:`, err);
      // don't throw, continue with other files
    }
  }
  return rawIssues;
};
