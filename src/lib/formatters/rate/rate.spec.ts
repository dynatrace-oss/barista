import { DtRateUnit } from '../unit';
import { DtRate } from './rate';
import { DtBytes } from '../bytes/bytes';

describe('DtRate', () => {
  interface TestCase {
    input: number;
    rateUnit: DtRateUnit | string;
    inputRateUnit?: DtRateUnit;
    output: string;
  }

  let ratePipe: DtRate;
  let bytePipe: DtBytes;
  beforeEach(() => {
    ratePipe = new DtRate();
    bytePipe = new DtBytes();
  });

  describe('Transforming input of type number', () => {
    [
      {
        input: 10,
        rateUnit: DtRateUnit.PER_MINUTE,
        output: '10 /min',
      },
      {
        input: 200,
        rateUnit: DtRateUnit.PER_SECOND,
        output: '200 /s',
      },
      {
        input: 3000,
        rateUnit: 'request',
        output: '3000 /request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} without unit`, () => {
        expect(ratePipe.transform(testCase.input, testCase.rateUnit).toString())
          .toEqual(testCase.output);
      });
    });
  });

  describe('Transforming input of type DtFormattedValue', () => {
    [
      {
        input: 10,
        rateUnit: DtRateUnit.PER_MINUTE,
        output: '10 B/min',
      },
      {
        input: 200,
        rateUnit: DtRateUnit.PER_SECOND,
        output: '200 B/s',
      },
      {
        input: 3000,
        rateUnit: 'request',
        output: '3 kB/request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} orignal unit together with rate`, () => {
        const formattedValue = bytePipe.transform(testCase.input);
        expect(ratePipe.transform(formattedValue, testCase.rateUnit).toString())
          .toEqual(testCase.output);
      });
    });

  });
});
