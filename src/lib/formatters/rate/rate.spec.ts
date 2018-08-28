import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DtRateUnit } from '../unit';
import { DtRate } from './rate';

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
      ],
    });
  });

  describe('Transforming input with input of type number', () => {
    [
      {
        input: 10000,
        rateUnit: DtRateUnit.PER_MINUTE,
        output: '10k/min',
      },
      {
        input: 20000000,
        rateUnit: DtRateUnit.PER_SECOND,
        output: '20mil/s',
      },
      {
        input: 3000000000,
        rateUnit: 'request',
        output: '3bil/request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} without unit`, inject([DtRate], (pipe: DtRate) => {
        expect(pipe.transform(testCase.input, testCase.rateUnit).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
