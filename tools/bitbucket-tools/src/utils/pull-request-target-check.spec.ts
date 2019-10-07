import {
  masterTargetRef,
  minorTargetRef,
  patchTargetRef,
} from '../commit-message-validation/validators/bitbucket-ref.spec';
import {
  isMasterTarget,
  isMinorTarget,
  isPatchTarget,
} from './pull-request-target-check';

describe('target ref matching', () => {
  describe('isPatchTarget', () => {
    test('should return true if target is a patch branch', () => {
      expect(isPatchTarget(patchTargetRef)).toBe(true);
    });

    test('should return false if target is a minor branch', () => {
      expect(isPatchTarget(minorTargetRef)).toBe(false);
    });

    test('should return false if target is master branch', () => {
      expect(isPatchTarget(masterTargetRef)).toBe(false);
    });
  });

  describe('isMinorTarget', () => {
    test('should return false if target is a patch branch', () => {
      expect(isMinorTarget(patchTargetRef)).toBe(false);
    });

    test('should return true if target is a minor branch', () => {
      expect(isMinorTarget(minorTargetRef)).toBe(true);
    });

    test('should return false if target is master branch', () => {
      expect(isMinorTarget(masterTargetRef)).toBe(false);
    });
  });

  describe('isMasterTarget', () => {
    test('should return false if target is a patch branch', () => {
      expect(isMasterTarget(patchTargetRef)).toBe(false);
    });

    test('should return false if target is a minor branch', () => {
      expect(isMasterTarget(minorTargetRef)).toBe(false);
    });

    test('should return true if target is master branch', () => {
      expect(isMasterTarget(masterTargetRef)).toBe(true);
    });
  });
});
