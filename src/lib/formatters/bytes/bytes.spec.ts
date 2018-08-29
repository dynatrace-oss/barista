import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DtUnit } from '../unit';
import { DtBytes } from './bytes';
import { KILO_MULTIPLIER } from '../number-formatter';

describe('DtBytes', () => {
  interface TestCase {
    input: number;
    factor?: number;
    inputUnit?: DtUnit;
    output: string;
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        DtBytes,
      ],
    });
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
      it(`should display ${testCase.input} converted to auto unit`, inject([DtBytes], (pipe: DtBytes) => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      }));
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
      it(`should display different result (${testCase.output})`, inject([DtBytes], (pipe: DtBytes) => {
        expect(pipe.transform(testCase.input, testCase.factor, testCase.inputUnit).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
