import { BitbucketApiRef } from '../../interfaces/bitbucket/bitbucket-api-ref';
import { isMasterTarget } from '../../utils/pull-request-target-check';
import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';

/**
 * Validates if the target branch is master
 */
export function validateTargetBranchForBreaking(
  target: BitbucketApiRef,
): ValidatorResult {
  if (!isMasterTarget(target)) {
    return new PrError(
      'BreakingChangeAllowsOnlyMasterTarget',
      'Breaking changes can only target the master branch, please adjust the target branch or review your commit messages.',
    );
  }
}
