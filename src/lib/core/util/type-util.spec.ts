import { isDefined } from './type-util';

describe('TypeUtil', () => {

  describe('isDefined', () => {
    it('should be false if the value is undefined or null', () => {
      expect(isDefined(void 0)).toBeFalsy();
      expect(isDefined(null)).toBeFalsy();
    });
    it('should be true if the value is a number', () => {
      expect(isDefined(-1)).toBeTruthy();
      expect(isDefined(0)).toBeTruthy();
      expect(isDefined(1)).toBeTruthy();
    });
    it('should be true if the value is a string', () => {
      expect(isDefined('')).toBeTruthy();
      expect(isDefined('0')).toBeTruthy();
      expect(isDefined('random')).toBeTruthy();
    });
    it('should be true if the value is a boolean', () => {
      expect(isDefined(true)).toBeTruthy();
      expect(isDefined(false)).toBeTruthy();
    });
    it('should be true if the value is a symbol', () => {
      expect(isDefined(Symbol('foo'))).toBeTruthy();
    });
    it('should be true if the value is a complex object or function', () => {
      class A { }
      expect(isDefined({})).toBeTruthy();
      expect(isDefined([])).toBeTruthy();
      expect(isDefined(() => {})).toBeTruthy();
      expect(isDefined(A)).toBeTruthy();
      expect(isDefined(new A())).toBeTruthy();
    });
  });
});
