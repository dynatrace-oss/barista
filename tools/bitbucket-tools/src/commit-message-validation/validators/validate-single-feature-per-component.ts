import { CommitMessage } from '../../interfaces/commit-message';
import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';

/**
 * Looks at all commit messages within the PR and checks if there are
 * multiple feature commits for the same component.
 */
export function validateSingleFeaturePerComponent(
  commits: CommitMessage[],
): ValidatorResult {
  const featureCommits = commits.filter(commit => commit.type === 'feat');
  // If there are none, or only one feature commit, we don't need to
  // look any further.
  if (featureCommits.length <= 1) {
    return;
  }
  // Iterate through the feature commits and count commits per scope.
  const commitsPerScope: {
    [key: string]: number;
  } = {};
  for (const commit of commits) {
    if (commit.components.length) {
      for (const component of commit.components) {
        commitsPerScope[component] = commitsPerScope[component] || 0;
        commitsPerScope[component]++;
        if (commitsPerScope[component] > 1) {
          return new PrError(
            'SingleFeatureCommitPerScope',
            'Pull request contains multiple feature commits for the same scope, please squash your commits.',
          );
        }
      }
    }
  }
}
