import { DtUnit } from '../unit';
import { DtBits } from './bits';
import { KILO_MULTIPLIER } from '../number-formatter';

describe('DtBits', () => {
  interface TestCase {
    input: number;
    factor?: number;
    inputUnit?: DtUnit;
    output: string;
  }

  let pipe: DtBits;

  beforeEach(() => {
    pipe = new DtBits();
  });

  describe('Transforming input without defined outputUnit', () => {
    [
      {
        input: 0,
        output: '0 bit',
      },
      {
        input: 1,
        output: '1 bit',
      },
      {
        input: 1000,
        output: '1 kbit',
      },
      {
        input: 20000000,
        output: '20 Mbit',
      },
      {
        input: 12500000000,
        output: '12.5 Gbit',
      },
      {
        input: 1250000000000,
        output: '1.25 Tbit',
      },
      {
        input: 7121000000000000,
        output: '7.12 Pbit',
      },

    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} converted to auto unit`, () => {
        expect(pipe.transform(testCase.input).toString()).toEqual(testCase.output);
      });
    });
  });

  describe('Transforming input with different input unit', () => {
    const testCases: TestCase[] = [
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.BITS,
        output: '1 kbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.KILO_BITS,
        output: '1 Mbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.MEGA_BITS,
        output: '1 Gbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.GIGA_BITS,
        output: '1 Tbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.TERA_BITS,
        output: '1 Pbit',
      },
    ];
    testCases.forEach((testCase: TestCase) => {
      it(`should display different result (${testCase.output})`, () => {
        expect(pipe.transform(testCase.input, testCase.factor, testCase.inputUnit).toString())
          .toEqual(testCase.output);
      });
    });
  });
});
