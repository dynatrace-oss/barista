import { CommitMessage } from '../../interfaces/commit-message';
import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';

/**
 * Looks at all commit messages within the PR and checks if there are
 * mixed typed commits within the PR.
 */
export function validateNoMixingOfCommitTypes(
  commits: CommitMessage[],
): ValidatorResult {
  const typeSet = new Set<string>();
  for (const commit of commits) {
    typeSet.add(commit.type);
    if (typeSet.size > 1) {
      return new PrError(
        'NoTypeMixing',
        'Only one type of commit is allowed per PR, please clean up your commits.',
      );
    }
  }
}
