import { CommitMessage } from '../../interfaces/commit-message';
import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';

/**
 * Validates that only feat commits are allowed, when a PR is opened against
 * a minor branch.
 */
export function validateCommitsForMinorTarget(
  commits: CommitMessage[],
): ValidatorResult {
  const otherCommits = commits.filter(commit => commit.type !== 'feat');
  if (otherCommits.length > 0) {
    return new PrError(
      'MinorTargetAllowsOnlyFeatures',
      'When targeting minor branches only feat commits are allowed.',
    );
  }
}
