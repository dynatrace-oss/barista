import { DtCount } from './count';
import { DtUnit } from '../unit';
import { NO_DATA } from '../formatted-value';

describe('DtCount', () => {
  interface TestCase {
    input: number;
    inputUnit: DtUnit | string;
    output: string;
  }

  let pipe: DtCount;

  beforeEach(() => {
    pipe = new DtCount();
  });

  describe('Transforming input with default input unit', () => {
    [
      {
        input: 10000,
        inputUnit: DtUnit.COUNT,
        output: '10k',
      },
      {
        input: 20000000,
        inputUnit: DtUnit.COUNT,
        output: '20mil',
      },
      {
        input: 3000000000,
        inputUnit: DtUnit.COUNT,
        output: '3bil',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} without unit`, () => {
        expect(
          pipe.transform(testCase.input, testCase.inputUnit).toString(),
        ).toEqual(testCase.output);
      });
    });
  });

  describe('Transforming input with custom input unit', () => {
    [
      {
        input: 10000,
        inputUnit: 'req.',
        output: '10k req.',
      },
      {
        input: 20000000,
        inputUnit: 'host units',
        output: '20mil host units',
      },
      {
        input: 3000000000,
        inputUnit: 'u.',
        output: '3bil u.',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} together with custom unit`, () => {
        expect(
          pipe.transform(testCase.input, testCase.inputUnit).toString(),
        ).toEqual(testCase.output);
      });
    });
  });

  describe('Empty values / Invalid values', () => {
    it(`should return '${NO_DATA}' for empty values`, () => {
      expect(pipe.transform('')).toEqual(NO_DATA);
      expect(pipe.transform(null)).toEqual(NO_DATA);
      expect(pipe.transform(undefined)).toEqual(NO_DATA);
    });

    it(`should return '${NO_DATA}' for values that cannot be converted to numbers`, () => {
      class A {}
      expect(pipe.transform({})).toEqual(NO_DATA);
      expect(pipe.transform([])).toEqual(NO_DATA);
      expect(pipe.transform(() => {})).toEqual(NO_DATA);
      expect(pipe.transform(A)).toEqual(NO_DATA);
      expect(pipe.transform(new A())).toEqual(NO_DATA);
    });

    it(`should return '${NO_DATA}' for combined strings`, () => {
      expect(pipe.transform('123test').toString()).toEqual(NO_DATA);
    });
  });

  describe('Valid input types', () => {
    it('should handle numbers as strings', () => {
      expect(pipe.transform('123').toString()).toEqual('123');
      expect(pipe.transform('1234').toString()).toEqual('1.23k');
    });

    it('should handle 0', () => {
      expect(pipe.transform('0').toString()).toEqual('0');
      expect(pipe.transform(0).toString()).toEqual('0');
    });
  });
});
