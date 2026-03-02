// src/analysis/pipeline/generate-summary.ts
import OpenAI from 'openai';
import { PrismaService } from 'src/db/service/db.service';

export async function generateSummary(
  analysisId: string,
  prisma: PrismaService,
): Promise<void> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // fetch everything we need to build the summary
  const analysis = await prisma.analysis.findUnique({
    where: { id: analysisId },
    include: {
      issues: true,
      metrics: true,
      files: true,
    },
  });

  if (!analysis) return;

  // build a structured overview to send to OpenAI
  const overview = {
    totalFiles: analysis.totalFiles,
    totalLines: analysis.totalLines,
    issuesFound: analysis.issuesFound,
    complexityScore: analysis.complexityScore,
    issuesBySeverity: {
      critical: analysis.issues.filter((i) => i.severity === 'CRITICAL').length,
      high: analysis.issues.filter((i) => i.severity === 'HIGH').length,
      medium: analysis.issues.filter((i) => i.severity === 'MEDIUM').length,
      low: analysis.issues.filter((i) => i.severity === 'LOW').length,
    },
    issuesByCategory: {
      security: analysis.issues.filter((i) => i.category === 'SECURITY').length,
      bugRisk: analysis.issues.filter((i) => i.category === 'BUG_RISK').length,
      performance: analysis.issues.filter((i) => i.category === 'PERFORMANCE')
        .length,
      style: analysis.issues.filter((i) => i.category === 'STYLE').length,
      complexity: analysis.issues.filter((i) => i.category === 'COMPLEXITY')
        .length,
      codeSmell: analysis.issues.filter((i) => i.category === 'CODE_SMELL')
        .length,
    },
    topIssues: analysis.issues
      .filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH')
      .slice(0, 5)
      .map((i) => ({
        title: i.title,
        severity: i.severity,
        category: i.category,
        suggestion: i.suggestion,
      })),
    metrics: analysis.metrics.map((m) => ({
      name: m.name,
      value: m.value,
      unit: m.unit,
      type: m.type,
    })),
  };

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      max_tokens: 500,
      messages: [
        {
          role: 'system',
          content: `You are a senior software engineer providing a code review summary. 
                    Be concise, professional, and actionable.
                    Always structure your response as JSON with these fields:
                    - overall: overall health assessment (one sentence)
                    - score: code health score from 0 to 100
                    - highlights: array of 3 key findings
                    - recommendations: array of 3 actionable recommendations
                    - priority: the single most important thing to fix first`,
        },
        {
          role: 'user',
          content: `Here is the analysis data for this codebase:
                    ${JSON.stringify(overview, null, 2)}
                    
                    Provide a professional code review summary.`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content ?? '{}';

    // safely parse the JSON response
    let summary;
    try {
      summary = JSON.parse(content);
    } catch {
      // if OpenAI doesn't return valid JSON store it as plain text
      summary = { overall: content };
    }

    // save summary to Analysis record
    await prisma.analysis.update({
      where: { id: analysisId },
      data: { summary },
    });
  } catch (err) {
    console.error(`Failed to generate summary: ${err.message}`);

    // save a basic summary without AI if OpenAI fails
    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        summary: {
          overall: `Analysis completed with ${analysis.issuesFound} issues found across ${analysis.totalFiles} files.`,
          score: calculateBasicScore(analysis.issuesFound, analysis.totalFiles),
          highlights: [
            `${overview.issuesBySeverity.critical + overview.issuesBySeverity.high} high priority issues found`,
            `${overview.issuesByCategory.security} security vulnerabilities detected`,
            `Average complexity score: ${analysis.complexityScore}`,
          ],
          recommendations: [
            'Review and fix all CRITICAL and HIGH severity issues first',
            'Address security vulnerabilities immediately',
            'Refactor files with high complexity scores',
          ],
          priority: 'Fix all CRITICAL issues immediately',
        },
      },
    });
  }
}

// basic score calculation as fallback
function calculateBasicScore(issuesFound: number, totalFiles: number): number {
  if (totalFiles === 0) return 100;
  const issuesPerFile = issuesFound / totalFiles;
  const score = Math.max(0, 100 - issuesPerFile * 10);
  return parseFloat(score.toFixed(2));
}
