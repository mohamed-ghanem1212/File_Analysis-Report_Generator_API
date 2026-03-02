import { response } from 'express';
import OpenAI from 'openai';

import { PrismaService } from 'src/db/service/db.service';
import 'dotenv/config';
import Groq from 'groq-sdk';
export const enrichWithAiSuggestion = async (
  analysisId: string,
  prisma: PrismaService,
): Promise<void> => {
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  const issues = await prisma.issue.findMany({
    where: {
      analysisId,
      severity: { in: ['HIGH', 'CRITICAL'] },
      suggestion: '',
    },
  });
  if (issues.length === 0) return;
  for (const issue of issues) {
    try {
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',

        messages: [
          {
            role: 'system',
            content: `You are a senior software engineer doing a code review. 
                      Be concise and practical. Always provide a specific fix.`,
          },
          {
            role: 'user',
            content: `
                          This code has been flagged for: "${issue.title}"
                          Category: ${issue.category}
                          Severity: ${issue.severity}
                          
                          Code:
                          ${issue.codeSnippet}
                          
                          In 2-3 sentences explain why this is a problem and provide a specific fix.
                        `,
          },
        ],
      });
      const suggestions = response.choices[0]?.message?.content ?? '';
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          suggestion: suggestions,
        },
      });
    } catch (err) {
      console.error(`Failed to enrich issue ${issue.id}: ${err.message}`);
      continue;
    }
  }
};
