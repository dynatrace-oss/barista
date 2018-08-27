import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DtCount } from './count';
import { DtUnit } from '../unit';

describe('DtCount', () => {
  interface TestCase {
    input: number;
    inputUnit: DtUnit | string;
    output: string;
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        DtCount,
      ],
    });
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
      it(`should display ${testCase.input} without unit`, inject([DtCount], (pipe: DtCount) => {
        expect(pipe.transform(testCase.input, testCase.inputUnit).toString())
          .toEqual(testCase.output);
      }));
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
      it(`should display ${testCase.input} together with custom unit`, inject([DtCount], (pipe: DtCount) => {
        expect(pipe.transform(testCase.input, testCase.inputUnit).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
