// src/analysis/pipeline/cleanup.ts
import * as fs from 'fs-extra';
import * as path from 'path';

export async function cleanup(analysisId: string): Promise<void> {
  const clonePath = path.join('/tmp', `analysis-${analysisId}`);

  try {
    const exists = await fs.pathExists(clonePath);

    if (exists) {
      await fs.remove(clonePath);
      console.log(`Cleaned up: ${clonePath}`);
    }
  } catch (err) {
    // log but never throw
    // cleanup failure should never fail the analysis
    console.error(`Failed to cleanup ${clonePath}: ${err.message}`);
  }
}
