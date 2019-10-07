import { PrError } from '../validate-commits-in-pull-request';
import {
  masterTargetRef,
  minorTargetRef,
  patchTargetRef,
} from './bitbucket-ref.spec';
import { validateTargetBranchForBreaking } from './validate-target-branch-for-breaking';

describe('if PR contains breaking changes, only master is allowed', () => {
  test('should pass if breaking changes are targeting master', () => {
    expect(validateTargetBranchForBreaking(masterTargetRef)).toBeUndefined();
  });

  test('should fail if breaking changes target patch branch', () => {
    expect(validateTargetBranchForBreaking(patchTargetRef)).toBeInstanceOf(
      PrError,
    );
  });

  test('should fail if breaking changes target minor branch', () => {
    expect(validateTargetBranchForBreaking(minorTargetRef)).toBeInstanceOf(
      PrError,
    );
  });
});
