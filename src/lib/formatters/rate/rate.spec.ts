import { DtRateUnit } from '../unit';
import { DtRate } from './rate';
import { DtBytes } from '../bytes/bytes';

fdescribe('DtRate', () => {
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
        output: '3000 B/request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} orignal unit together with rate`, () => {
        const formattedValue = bytePipe.transform(testCase.input);
        expect(ratePipe.transform(formattedValue, testCase.rateUnit).toString())
          .toEqual(testCase.output);
      });
    });

  });

  describe('converting rates', () => {
    [
      {
        input: 60,
        rateUnit: DtRateUnit.PER_SECOND,
        inputRateUnit: DtRateUnit.PER_MINUTE,
        output: '1 /s',
      },
      {
        input: 1,
        rateUnit: DtRateUnit.PER_DAY,
        inputRateUnit: DtRateUnit.PER_MINUTE,
        output: '1440 /d',
      },
      {
        input: 2,
        rateUnit: 'request',
        inputRateUnit: DtRateUnit.PER_DAY,
        output: '2 /request',
      },
      {
        input: 2,
        rateUnit: DtRateUnit.PER_WEEK,
        inputRateUnit: DtRateUnit.PER_DAY,
        output: '14 /w',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} orignal unit together with rate`, () => {
        expect(ratePipe.transform(testCase.input, testCase.rateUnit, testCase.inputRateUnit).toString())
          .toEqual(testCase.output);
      });
    });

  });

});
