import { isDefined } from './type-util';

describe('TypeUtil', () => {
  describe('isDefined', () => {

    it('check return false if value is undefined', () => {
      expect(isDefined(void 0)).toBeFalsy();
    });

    it('check return false if value is null', () => {
      expect(isDefined(null)).toBeFalsy();
    });

    it('check return true if value is a number', () => {
      expect(isDefined(-1)).toBeTruthy();
      expect(isDefined(0)).toBeTruthy();
      expect(isDefined(1)).toBeTruthy();
    });

    it('check return true if value is a string', () => {
      expect(isDefined('')).toBeTruthy();
      expect(isDefined('a')).toBeTruthy();
    });

    it('check return true if value is a boolean', () => {
      expect(isDefined(false)).toBeTruthy();
      expect(isDefined(true)).toBeTruthy();
    });

    it('check return true if value is an object or function', () => {
      expect(isDefined([])).toBeTruthy();
      expect(isDefined({})).toBeTruthy();
      expect(isDefined(() => {})).toBeTruthy();
      expect(isDefined((class A {}))).toBeTruthy();
    });
  });
});
