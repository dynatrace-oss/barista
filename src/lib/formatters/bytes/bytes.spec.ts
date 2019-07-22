import { DtUnit } from '../unit';
import { DtBytes } from './bytes';
import { KILO_MULTIPLIER } from '../number-formatter';
import { NO_DATA } from '../formatted-value';

describe('DtBytes', () => {
  interface TestCase {
    input: number;
    factor?: number;
    inputUnit?: DtUnit;
    output: string;
  }

  let pipe: DtBytes;

  beforeEach(() => {
    pipe = new DtBytes();
  });

  describe('Transforming input without defined outputUnit', () => {
    [
      {
        input: 0,
        output: '0 B',
      },
      {
        input: 1,
        output: '1 B',
      },
      {
        input: 1000,
        output: '1 kB',
      },
      {
        input: 20000000,
        output: '20 MB',
      },
      {
        input: 12500000000,
        output: '12.5 GB',
      },
      {
        input: 1250000000000,
        output: '1.25 TB',
      },
      {
        input: 7121000000000000,
        output: '7.12 PB',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} converted to auto unit`, () => {
        expect(pipe.transform(testCase.input).toString()).toEqual(
          testCase.output,
        );
      });
    });
  });

  describe('Transforming input with different input unit', () => {
    [
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.BYTES,
        output: '1 kB',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.KILO_BYTES,
        output: '1 MB',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.MEGA_BYTES,
        output: '1 GB',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.GIGA_BYTES,
        output: '1 TB',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.TERA_BYTES,
        output: '1 PB',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.PETA_BYTES,
        output: '1,000 PB',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display different result (${testCase.output})`, () => {
        expect(
          pipe
            .transform(testCase.input, testCase.factor, testCase.inputUnit)
            .toString(),
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
      expect(pipe.transform('123').toString()).toEqual('123 B');
      expect(pipe.transform('1234').toString()).toEqual('1.23 kB');
    });

    it('should handle 0', () => {
      expect(pipe.transform('0').toString()).toEqual('0 B');
      expect(pipe.transform(0).toString()).toEqual('0 B');
    });
  });
});
