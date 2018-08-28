import { inject, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DtUnit } from '../unit';
import { DtMegabytes } from './megabytes';

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
        DtMegabytes,
      ],
    });
  });

  describe('Transforming input ', () => {
    [
      {
        input: 1000,
        output: '0.001 MB',
      },
      {
        input: 1000000,
        output: '1 MB',
      },
      {
        input: 1000000000,
        output: '1,000 MB',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display result converted to KB (${testCase.output})`, inject([DtMegabytes], (pipe: DtMegabytes) => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      }));
    });
  });

});
