import type { IssueCategory } from '../interface/rawIssue.interface';

export const mapCategory = (ruleId: string): IssueCategory => {
  if (!ruleId) return 'CODE_SMELL';

  const securityRules = ['no-eval', 'no-implied-eval', 'no-new-func'];
  const bugRules = ['no-undef', 'no-unreachable', 'eqeqeq', 'no-dupe-keys'];
  const complexityRules = ['complexity', 'max-depth', 'max-lines'];
  const styleRules = ['no-console', 'quotes', 'semi', 'indent'];
  const performanceRules = ['no-await-in-loop', 'no-inner-declarations'];

  if (securityRules.includes(ruleId)) return 'SECURITY';
  if (bugRules.includes(ruleId)) return 'BUG_RISK';
  if (complexityRules.includes(ruleId)) return 'COMPLEXITY';
  if (styleRules.includes(ruleId)) return 'STYLE';
  if (performanceRules.includes(ruleId)) return 'PERFORMANCE';
  return 'CODE_SMELL';
};
