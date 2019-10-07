import { CommitMessage } from '../../interfaces/commit-message';
import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';

/**
 * Validates that only fix or perf commits are allowed, when a PR is opened against
 * a patch branch.
 */
export function validateCommitsForPatchTarget(
  commits: CommitMessage[],
): ValidatorResult {
  const otherCommits = commits
    .filter(commit => commit.type !== 'fix')
    .filter(commit => commit.type !== 'perf');
  if (otherCommits.length > 0) {
    return new PrError(
      'PatchTargetAllowsOnlyFixes',
      'When targeting patch branches only fix and perf commits are allowed.',
    );
  }
}
