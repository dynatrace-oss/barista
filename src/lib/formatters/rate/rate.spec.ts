import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DtRateUnit } from '../unit';
import { DtRate } from './rate';
import { DtBytes } from '../bytes/bytes';

describe('DtRate', () => {
  interface TestCase {
    input: number;
    rateUnit: DtRateUnit | string;
    output: string;
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        DtRate,
        DtBytes,
      ],
    });
  });

  describe('Transforming input of type number', () => {
    [
      {
        input: 10000,
        rateUnit: DtRateUnit.PER_MINUTE,
        output: '10k /min',
      },
      {
        input: 20000000,
        rateUnit: DtRateUnit.PER_SECOND,
        output: '20mil /s',
      },
      {
        input: 3000000000,
        rateUnit: 'request',
        output: '3bil /request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} without unit`, inject([DtRate], (pipe: DtRate) => {
        expect(pipe.transform(testCase.input, testCase.rateUnit).toString())
          .toEqual(testCase.output);
      }));
    });
  });

  describe('Transforming input of type DtFormattedValue', () => {
    [
      {
        input: 10000,
        rateUnit: DtRateUnit.PER_MINUTE,
        output: '10 kB/min',
      },
      {
        input: 20000000,
        rateUnit: DtRateUnit.PER_SECOND,
        output: '20 MB/s',
      },
      {
        input: 3000000000,
        rateUnit: 'request',
        output: '3 GB/request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} orignal unit together with rate`,
         inject([DtRate, DtBytes], (pipe: DtRate, otherPipe: DtBytes) => {
        const formattedValue = otherPipe.transform(testCase.input);
        expect(pipe.transform(formattedValue, testCase.rateUnit).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
