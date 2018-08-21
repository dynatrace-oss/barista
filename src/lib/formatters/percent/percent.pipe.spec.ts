import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormatterUtil } from '@dynatrace/angular-components/formatters/formatter-util';
import { PercentPipe } from '@dynatrace/angular-components/formatters/percent/percent.pipe';

describe('PercentPipe', () => {
  interface TestCase {
    input: number;
    output: string;
  }

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [
        {
          provide: FormatterUtil,
          useClass: FormatterUtil,
        },
        PercentPipe,
      ],
    });
  });

  describe('adjusted precision', () => {

    [
      {
        input: 0.123456789,
        output: '0.123 %',
      },
      {
        input: 1.23456789,
        output: '1.23 %',
      },
      {
        input: 12.3456789,
        output: '12.3 %',
      },
      {
        input: 123.456789,
        output: '123 %',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} with adjusted precision`, inject([PercentPipe], (pipe: PercentPipe) => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
