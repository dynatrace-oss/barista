import { isDefined, isEmpty, isNumber, isObject } from './type-util';

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

  describe('isEmpty', () => {
    it('should be true if the value is undefined or null', () => {
      expect(isEmpty(void 0)).toBeTruthy();
      expect(isEmpty(undefined)).toBeTruthy();
      expect(isEmpty(null)).toBeTruthy();
    });
    it('should be true if the value is an empty string', () => {
      expect(isEmpty('')).toBeTruthy();
    });
    it('should be false if the value is a number', () => {
      expect(isEmpty(-1)).toBeFalsy();
      expect(isEmpty(0)).toBeFalsy();
      expect(isEmpty(1)).toBeFalsy();
    });
    it('should be false if the value is a string', () => {
      expect(isEmpty('0')).toBeFalsy();
      expect(isEmpty('random')).toBeFalsy();
    });
    it('should be false if the value is a boolean', () => {
      expect(isEmpty(true)).toBeFalsy();
      expect(isEmpty(false)).toBeFalsy();
    });
    it('should be false if the value is a symbol', () => {
      expect(isEmpty(Symbol('foo'))).toBeFalsy();
    });
    it('should be false if the value is a complex object or function', () => {
      class A { }
      expect(isEmpty({})).toBeFalsy();
      expect(isEmpty([])).toBeFalsy();
      expect(isEmpty(() => {})).toBeFalsy();
      expect(isEmpty(A)).toBeFalsy();
      expect(isEmpty(new A())).toBeFalsy();
    });
  });

  describe('isNumber', () => {
    it('should be false if the value is undefined or null', () => {
      expect(isNumber(void 0)).toBeFalsy();
      expect(isNumber(undefined)).toBeFalsy();
      expect(isNumber(null)).toBeFalsy();
    });
    it('should be false if the value is an empty string', () => {
      expect(isNumber('')).toBeFalsy();
    });
    it('should be true if the value is a number', () => {
      expect(isNumber(-1)).toBeTruthy();
      expect(isNumber(0)).toBeTruthy();
      expect(isNumber(1)).toBeTruthy();
    });
    it('should be false if the value is a string containing numbers', () => {
      expect(isNumber('123test')).toBeFalsy();
    });
    it('should be false if the value is a string that cannot be converted', () => {
      expect(isNumber('random')).toBeFalsy();
    });
    it('should be true if the value is a string can be converted', () => {
      expect(isNumber('123')).toBeTruthy();
    });
    it('should be false if the value is a boolean', () => {
      expect(isNumber(true)).toBeFalsy();
      expect(isNumber(false)).toBeFalsy();
    });
    it('should be false if the value is a symbol', () => {
      expect(isNumber(Symbol('foo'))).toBeFalsy();
    });
    it('should be false if the value is a complex object or function', () => {
      class A { }
      expect(isNumber({})).toBeFalsy();
      expect(isNumber([])).toBeFalsy();
      expect(isNumber(() => {})).toBeFalsy();
      expect(isNumber(A)).toBeFalsy();
      expect(isNumber(new A())).toBeFalsy();
    });
  });

  describe('isObject', () => {
    it('should be true if the value is an Object', () => {
      expect(isObject({})).toBeTruthy();
      expect(isObject(new Object())).toBeTruthy();
      // tslint:disable-next-line: prefer-object-spread
      expect(isObject(Object.assign({}))).toBeTruthy();
    });
    it('should be false if the value is an array', () => {
      expect(isObject(new Array(1))).toBeFalsy();
      expect(isObject([])).toBeFalsy();
    });
    it('should be false if the value is undefined or null', () => {
      expect(isObject(void 0)).toBeFalsy();
      expect(isObject(undefined)).toBeFalsy();
      expect(isObject(null)).toBeFalsy();
    });
    it('should be false if the value is a number', () => {
      expect(isObject(-1)).toBeFalsy();
      expect(isObject(0)).toBeFalsy();
      expect(isObject(1)).toBeFalsy();
    });
    it('should be false if the value is a string', () => {
      expect(isObject('')).toBeFalsy();
      expect(isObject('0')).toBeFalsy();
      expect(isObject('random')).toBeFalsy();
    });
    it('should be false if the value is a symbol', () => {
      expect(isObject(Symbol('foo'))).toBeFalsy();
    });
    it('should be false if the value is a boolean', () => {
      expect(isObject(true)).toBeFalsy();
      expect(isObject(false)).toBeFalsy();
    });
  });
});
