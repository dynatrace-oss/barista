import { NO_DATA } from '../formatted-value';
import { DtUnit } from '../unit';
import { DtMegabytes } from './megabytes';

describe('DtMegabytes', () => {
  interface TestCase {
    input: number;
    factor?: number;
    inputUnit?: DtUnit;
    output: string;
  }

  let pipe: DtMegabytes;

  beforeEach(() => {
    pipe = new DtMegabytes();
  });

  describe('Transforming input', () => {
    [
      {
        input: 1000,
        output: '0.001 MB',
      },
      {
        input: 1000000,
        output: '1 MB',
      },
      {
        input: 1000000000,
        output: '1,000 MB',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display result converted to MB (${testCase.output})`, () => {
        expect(pipe.transform(testCase.input).toString()).toEqual(
          testCase.output,
        );
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
      expect(pipe.transform('123000000').toString()).toEqual('123 MB');
      expect(pipe.transform('123400').toString()).toEqual('0.123 MB');
    });

    it('should handle 0', () => {
      expect(pipe.transform('0').toString()).toEqual('0 MB');
      expect(pipe.transform(0).toString()).toEqual('0 MB');
    });
  });
});
