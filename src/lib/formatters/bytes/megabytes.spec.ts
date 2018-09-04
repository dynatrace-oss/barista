import { DtUnit } from '../unit';
import { DtMegabytes } from './megabytes';

describe('DtMegabytes', () => {
  interface TestCase {
    input: number;
    factor?: number;
    inputUnit?: DtUnit;
    output: string;
  }

  let pipe: DtMegabytes;

  beforeEach(() => {
    pipe = new DtMegabytes();
  });

  describe('Transforming input', () => {
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
      it(`should display result converted to MB (${testCase.output})`, () => {
        expect(pipe.transform(testCase.input).toString())
          .toEqual(testCase.output);
      });
    });
  });

});
