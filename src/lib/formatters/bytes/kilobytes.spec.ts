import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DtUnit } from '../unit';
import { DtKilobytes } from './kilobytes';

describe('DtKilobytes', () => {
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
        DtKilobytes,
      ],
    });
  });

  describe('Transforming input ', () => {
    [
      {
        input: 100,
        output: '0.1 kB',
      },
      {
        input: 100000,
        output: '100 kB',
      },
      {
        input: 100000000,
        output: '100,000 kB',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display result converted to KB (${testCase.output})`, inject([DtKilobytes], (pipe: DtKilobytes) => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
