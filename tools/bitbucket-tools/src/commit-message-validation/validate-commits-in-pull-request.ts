import { BitbucketApiRef } from '../interfaces/bitbucket/bitbucket-api-ref';
import { CommitMessage } from '../interfaces/commit-message';
import { pullRequestContainsBreakingChanges } from '../utils/pull-request-contains-breaking-changes';
import { isMinorTarget, isPatchTarget } from '../utils/pull-request-target-check';
import { validateBreakingChange } from './validators/validate-breaking-change';
import { validateCommitsForMinorTarget } from './validators/validate-commits-for-minor-target';
import { validateCommitsForPatchTarget } from './validators/validate-commits-for-patch-target';
import { validateNoMixingOfCommitTypes } from './validators/validate-no-mixing-of-commit-types';
import { validateNumberOfCommitsForFeatureFixPerformance } from './validators/validate-number-of-commits-for-feature-fix-performance';
import { validateSingleFeaturePerComponent } from './validators/validate-single-feature-per-component';
import { validateSquashMe } from './validators/validate-squash-me';
import { validateTargetBranchForBreaking } from './validators/validate-target-branch-for-breaking';

/** Defines which types the PrError can have */
export type PrErrorType =
  | 'SquashMe'
  | 'SingleFeatureCommitPerScope'
  | 'NoTypeMixing'
  | 'SingleCommitPerFeatFixPerf'
  | 'BreakingChangeViolation'
  | 'PatchTargetAllowsOnlyFixes'
  | 'MinorTargetAllowsOnlyFeatures'
  | 'BreakingChangeAllowsOnlyMasterTarget';

/** PrError Class representing a violation in the commit messages. */
export class PrError {
  constructor(public error: PrErrorType, public message: string) {}
}

export type ValidatorResult = PrError | undefined;

/**
 * Validations that are being run against the commits in the PR
 *
 * - Commit message cannot contain 'squash', 'squash me' or any other hints for further required rebase action.
 * - Pull requests can only contain a single feature per component scope.
 * - Pull requests cannot mix commit types like *feat*, *fix*, *perf*. Single purpose pull requests are appreciated.
 * - BREAKING CHANGE keywords should be spelled correctly.
 * - When the pull request is targeting a patch branch, only fix and perf commit types are allowed.
 * - When the pull request is targeting a minor branch, only feat commit types are allowed.
 * - BREAKING CHANGE commits can only target master.
 *
 * Number of commits for certain types are limited per pull request.
 * *feat* : 1
 * *fix* : 1
 * *perf* : 1
 *
 * If you add some documentation that accompanies a feature, rather squash the documentation into the feature
 * commit than continue with a *feat* and *docs* commit.
 */

/**
 * Validate the array of commit messages and return an Errors array,
 * if any of the validations are being violated.
 */
export function validateCommitsInPr(
  commits: CommitMessage[],
  target: BitbucketApiRef,
): PrError[] {
  const errors: ValidatorResult[] = [];

  // Run checks that apply to every commit.
  for (const commit of commits) {
    // check for squash me messages
    errors.push(validateSquashMe(commit.message));

    // check for breaking change spellings
    errors.push(validateBreakingChange(commit.message));
  }

  // run checks that apply to the sum of commits within the pr.
  errors.push(validateSingleFeaturePerComponent(commits));
  errors.push(validateNoMixingOfCommitTypes(commits));
  errors.push(validateNumberOfCommitsForFeatureFixPerformance(commits));

  // Run checks that apply only based on target branches.
  // Check if the target branch is a patch branch as there are only
  // fix or perf commits allowed.
  if (isPatchTarget(target)) {
    errors.push(validateCommitsForPatchTarget(commits));
  }
  // Check if the target branch is a minor branch as there are only
  // feat commits allowed.
  if (isMinorTarget(target)) {
    errors.push(validateCommitsForMinorTarget(commits));
  }
  // If the PR contains breaking changes, it is only allowed to target
  // the master branch.
  if (pullRequestContainsBreakingChanges(commits)) {
    errors.push(validateTargetBranchForBreaking(target));
  }

  return errors.filter(Boolean) as PrError[];
}
