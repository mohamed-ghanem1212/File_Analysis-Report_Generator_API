import { simpleGit, CleanOptions, SimpleGit } from 'simple-git';
import * as fs from 'fs-extra';
import os from 'os';
import * as path from 'path';
export async function fetchCode(
  repositoryUrl: string,
  branch: string,
  analysisId: string,
): Promise<{ clonePath: string; commitHash: string }> {
  const clonePath = path.join(os.tmpdir(), `analysis-${analysisId}`);
  await fs.remove(clonePath);
  await fs.ensureDir(clonePath);

  const git: SimpleGit = simpleGit();
  await git.clone(repositoryUrl, clonePath, [
    '--branch',
    branch,
    '--depth',
    '1',
  ]);
  const cloneRepo = simpleGit(clonePath);
  const log = await cloneRepo.log({ maxCount: 1 });
  const commitHash = log.latest?.hash ?? 'Unknown';
  return { commitHash, clonePath };
}
