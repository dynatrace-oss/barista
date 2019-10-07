import { BaristaPullRequestTag } from '../bitbucket-communication/add-tags-to-pull-request';
import { CommitMessage } from '../interfaces/commit-message';
import { pullRequestContainsBreakingChanges } from '../utils/pull-request-contains-breaking-changes';
/**
 *  Rules for cherrypicking labels for pull requests targeting master
 *
 *                         PR contains
 *                    BREAKING CHANGE COMMITS?
 *                    /               \
 *                  /                  \
 *                Yes                  No
 *               /                      \
 *             /                         \
 *        Add label *major*           contains *feat* commits
 *                                     /            \
 *                                   /               \
 *                                Yes                No
 *                                /                   \
 *                              /                      \
 *                       Add labels *minor*         contains *fix* or *perf* commits
 *                       and *target:minor*          /           \
 *                                                 /              \
 *                                              Yes               No
 *                                              /                  \
 *                                            /                     \
 *                                       Add labels *patch*,       Add labels
 *                                       *target:patch* and        *target:minor*
 *                                       *target:minor*            *target:patch*
 *
 */

/**
 * Determines which labels should be added to the PR
 */
export function determineCherryPickLabelsForMasterTarget(
  commits: CommitMessage[],
): BaristaPullRequestTag[] {
  // Check if the commit messages contain breaking changes and add the respective label
  // if necessary.
  const containsBreakingChanges = pullRequestContainsBreakingChanges(commits);
  if (containsBreakingChanges) {
    return ['major'];
  }

  // Check if the commit messages contain feat commits and add the respective label.
  const containsFeatureCommits = commits.some(c => c.type === 'feat');
  if (containsFeatureCommits) {
    return ['minor', 'target:minor'];
  }

  // Check if the commit messages contain fix or perf commits
  const containsFixOrPerfCommits = commits.some(
    c => c.type === 'fix' || c.type === 'perf',
  );
  if (containsFixOrPerfCommits) {
    return ['patch', 'target:minor', 'target:patch'];
  }

  // If we fell through all the checks, it's most likely build updates, documentation commits or
  // any other sort of chores related to the maintainence of the angular-components
  // repository.
  return ['target:minor', 'target:patch'];
}
