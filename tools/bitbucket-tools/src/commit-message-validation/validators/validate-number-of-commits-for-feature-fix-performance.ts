import { CommitMessage } from '../../interfaces/commit-message';
import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';

/**
 * A PR has a maximum number of allowed commits for feature, fix and performance.
 * Feat: 1
 * Fix: 1
 * Perf: 1
 */
export function validateNumberOfCommitsForFeatureFixPerformance(
  commits: CommitMessage[],
): ValidatorResult {
  const featureCommits = commits.filter(commit => commit.type === 'feat');
  const fixCommits = commits.filter(commit => commit.type === 'fix');
  const performanceCommits = commits.filter(commit => commit.type === 'perf');
  if (featureCommits.length > 1) {
    return new PrError(
      'SingleCommitPerFeatFixPerf',
      'Only one feature commit is allowed per PR, please clean up your commits.',
    );
  }
  if (fixCommits.length > 1) {
    return new PrError(
      'SingleCommitPerFeatFixPerf',
      'Only one fix commit is allowed per PR, please clean up your commits.',
    );
  }
  if (performanceCommits.length > 1) {
    return new PrError(
      'SingleCommitPerFeatFixPerf',
      'Only one performance commit is allowed per PR, please clean up your commits.',
    );
  }
}
