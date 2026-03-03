// src/reports/utils/pdf-generator.ts
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export function generatePdfFromReport(report: any): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const content = report.content;

    // ── Header ──────────────────────────────────────
    doc
      .fillColor('#1E40AF')
      .fontSize(24)
      .text('CodeLens Analysis Report', { align: 'center' });

    doc.moveDown();

    // ── Overview ────────────────────────────────────
    doc.fillColor('#1F2937').fontSize(16).text('Overview');

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#E5E7EB');
    doc.moveDown(0.5);

    doc.fontSize(11).fillColor('#374151');
    doc.text(`Project: ${content.overview.projectName}`);
    doc.text(`Branch: ${content.overview.branch}`);
    doc.text(`Commit: ${content.overview.commitHash}`);
    doc.text(`Total Files: ${content.overview.totalFiles}`);
    doc.text(`Total Lines: ${content.overview.totalLines}`);
    doc.text(`Issues Found: ${content.overview.issuesFound}`);
    doc.text(`Complexity Score: ${content.overview.complexityScore}`);

    doc.moveDown();

    // ── Summary ─────────────────────────────────────
    if (content.overview.summary) {
      doc.fontSize(16).fillColor('#1F2937').text('AI Summary');
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#E5E7EB');
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor('#374151');
      doc.text(`Overall: ${content.overview.summary.overall ?? 'N/A'}`);
      doc.text(`Score: ${content.overview.summary.score ?? 'N/A'}`);

      if (content.overview.summary.highlights?.length > 0) {
        doc.moveDown(0.5);
        doc.text('Highlights:', { underline: true });
        content.overview.summary.highlights.forEach((h: string) => {
          doc.text(`  • ${h}`);
        });
      }

      if (content.overview.summary.recommendations?.length > 0) {
        doc.moveDown(0.5);
        doc.text('Recommendations:', { underline: true });
        content.overview.summary.recommendations.forEach((r: string) => {
          doc.text(`  • ${r}`);
        });
      }
    }

    doc.moveDown();

    // ── Issues Breakdown ────────────────────────────
    doc.fontSize(16).fillColor('#1F2937').text('Issues Breakdown');
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#E5E7EB');
    doc.moveDown(0.5);

    doc.fontSize(11).fillColor('#374151');
    doc.text('By Severity:');
    doc.text(`  Critical: ${content.issueBreakdown.bySeverity.critical}`);
    doc.text(`  High:     ${content.issueBreakdown.bySeverity.high}`);
    doc.text(`  Medium:   ${content.issueBreakdown.bySeverity.medium}`);
    doc.text(`  Low:      ${content.issueBreakdown.bySeverity.low}`);

    doc.moveDown(0.5);
    doc.text('By Category:');
    doc.text(`  Security:    ${content.issueBreakdown.byCategory.security}`);
    doc.text(`  Bug Risk:    ${content.issueBreakdown.byCategory.bugRisk}`);
    doc.text(`  Performance: ${content.issueBreakdown.byCategory.performance}`);
    doc.text(`  Style:       ${content.issueBreakdown.byCategory.style}`);
    doc.text(`  Complexity:  ${content.issueBreakdown.byCategory.complexity}`);
    doc.text(`  Code Smell:  ${content.issueBreakdown.byCategory.codeSmell}`);

    doc.moveDown();

    // ── Top Issues ──────────────────────────────────
    doc.fontSize(16).fillColor('#1F2937').text('Issues');
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#E5E7EB');
    doc.moveDown(0.5);

    content.issues?.slice(0, 20).forEach((issue: any, index: number) => {
      doc
        .fontSize(11)
        .fillColor('#1E40AF')
        .text(`${index + 1}. ${issue.title}`);

      doc.fontSize(10).fillColor('#374151');
      doc.text(
        `   Severity: ${issue.severity}  |  Category: ${issue.category}`,
      );
      doc.text(`   Line: ${issue.lineNumber}, Column: ${issue.columnNumber}`);

      if (issue.suggestion) {
        doc.text(`   Suggestion: ${issue.suggestion}`);
      }

      doc.moveDown(0.5);

      // add new page if running out of space
      if (doc.y > 700) {
        doc.addPage();
      }
    });

    doc.end();
  });
}
