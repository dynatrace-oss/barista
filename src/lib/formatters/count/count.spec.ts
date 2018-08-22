import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormatterUtil } from '../formatter-util';
import { DtCount } from './count';

describe('DtCount', () => {
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
        DtCount,
      ],
    });
  });

  describe('adjusted precision', () => {

    [
      {
        input: 0.123456789,
        output: '0.123',
      },
      {
        input: 1.23456789,
        output: '1.23',
      },
      {
        input: 12.3456789,
        output: '12.3',
      },
      {
        input: 123.456789,
        output: '123',
      },
      {
        input: 0.987654321,
        output: '0.988',
      },
      {
        input: 9.87654321,
        output: '9.88',
      },
      {
        input: 98.7654321,
        output: '98.8',
      },
      {
        input: 987.654321,
        output: '988',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} with adjusted precision`, inject([DtCount], (pipe: DtCount) => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      }));
    });
  });

  describe('abbreviation', () => {

    [
      {
        input: 10000,
        output: '10k',
      },
      {
        input: 20000000,
        output: '20mil',
      },
      {
        input: 3000000000,
        output: '3bil',
      },
      {
        input: 1111,
        output: '1.11k',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} in abbreviated version`, inject([DtCount], (pipe: DtCount) => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
