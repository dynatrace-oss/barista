import { DtPercent } from './percent';

describe('DtPercentPipe', () => {
  interface TestCase {
    input: number;
    output: string;
  }

  let pipe: DtPercent;

  beforeEach(() => {
    pipe = new DtPercent();
  });

  describe('Transforming input', () => {

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
      it(`should display ${testCase.input} with adjusted precision and % sign`, () => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      });
    });
  });

});
