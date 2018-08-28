import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DtUnit } from '../unit';
import { DtBytes } from './bytes';

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
        factor: 1000,
        inputUnit: DtUnit.BYTES,
        output: '1 kB',
      },
      {
        input: 1000,
        factor: 1000,
        inputUnit: DtUnit.KILO_BYTES,
        output: '1 MB',
      },
      {
        input: 1000,
        factor: 1000,
        inputUnit: DtUnit.MEGA_BYTES,
        output: '1 GB',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display different result (${testCase.output})`, inject([DtBytes], (pipe: DtBytes) => {
        expect(pipe.transform(testCase.input, testCase.factor, testCase.inputUnit).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
