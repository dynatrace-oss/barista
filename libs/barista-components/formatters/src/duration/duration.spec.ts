/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-magic-numbers */
import { NO_DATA } from '../formatted-value';
import { DtTimeUnit } from '../unit';
import { DtDuration } from './duration';

describe('DtDurationPipe', () => {
  interface TestCase {
    input: number;
    inputUnit: DtTimeUnit | undefined;
    output: string;
  }

  interface TestCaseToUnit {
    input: number;
    inputUnit: DtTimeUnit | undefined;
    outputUnit: DtTimeUnit | undefined;
    output: string;
  }

  interface TestCasePrecision {
    input: number;
    precision: string | number;
    inputUnit: DtTimeUnit;
    outputUnit: DtTimeUnit | undefined;
    output: string;
    maxDecimals?: number;
  }

  let pipe: DtDuration;

  beforeEach(() => {
    pipe = new DtDuration();
  });

  describe('Transforming input', () => {
    [
      {
        input: 1,
        inputUnit: undefined,
        output: '1 ms',
      },
      {
        input: 31540000000,
        inputUnit: undefined,
        output: '1 y',
      },
      {
        input: 2629738737.72,
        inputUnit: undefined,
        output: '1 mo',
      },
      {
        input: 24 * 60 * 60 * 1000,
        inputUnit: undefined,
        output: '1 d',
      },
      {
        input: 1.5,
        inputUnit: DtTimeUnit.MONTH,
        output: '1 mo 15 d 4 h',
      },
      {
        input: 1.5,
        inputUnit: DtTimeUnit.HOUR,
        output: '1 h 30 min',
      },
      {
        input: 1.5,
        inputUnit: DtTimeUnit.MINUTE,
        output: '1 min 30 s',
      },
      {
        input: 1.5,
        inputUnit: DtTimeUnit.SECOND,
        output: '1 s 500 ms',
      },
      {
        input: -1,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: '< 1 ms',
      },
      {
        input: 0,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: '< 1 ms',
      },
      {
        input: 0.9,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: '900 µs',
      },
      {
        input: 0.4,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: '400 µs',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.output} when input is ${testCase.input} and inputUnit is '${testCase.inputUnit}'`, () => {
        expect(
          pipe
            .transform(testCase.input, 'DEFAULT', undefined, testCase.inputUnit)
            .toString()
            .trim(),
        ).toBe(testCase.output);
      });
    });
  });

  describe('Transforming input with outputUnit parameter set', () => {
    [
      {
        input: 120,
        inputUnit: DtTimeUnit.MINUTE,
        outputUnit: DtTimeUnit.HOUR,
        output: '2 h',
      },
      {
        input: 2,
        inputUnit: DtTimeUnit.HOUR,
        outputUnit: DtTimeUnit.MINUTE,
        output: '120 min',
      },
      {
        input: 1600,
        inputUnit: DtTimeUnit.MILLISECOND,
        outputUnit: DtTimeUnit.SECOND,
        output: '1 s',
      },
      {
        input: 1400,
        inputUnit: DtTimeUnit.MILLISECOND,
        outputUnit: DtTimeUnit.SECOND,
        output: '1 s',
      },
      {
        input: 400,
        inputUnit: DtTimeUnit.MILLISECOND,
        outputUnit: DtTimeUnit.SECOND,
        output: '< 1 s',
      },
      {
        input: 15,
        inputUnit: DtTimeUnit.MINUTE,
        outputUnit: DtTimeUnit.HOUR,
        output: '< 1 h',
      },
      {
        input: 1,
        outputUnit: DtTimeUnit.NANOSECOND,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: '1 ns',
      },
      {
        input: 1000,
        outputUnit: DtTimeUnit.MICROSECOND,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: '1 µs',
      },
      {
        input: 1,
        outputUnit: DtTimeUnit.MICROSECOND,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: '< 1 µs',
      },
      {
        input: 1,
        outputUnit: undefined,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: '1 µs',
      },
      {
        input: 1000,
        outputUnit: undefined,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: '1 ms',
      },
      {
        input: 1001,
        outputUnit: undefined,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: '1 ms 1 µs',
      },
      {
        input: 1000000000,
        outputUnit: DtTimeUnit.SECOND,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: '1 s',
      },
      {
        input: 100000,
        outputUnit: DtTimeUnit.SECOND,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: '< 1 s',
      },
    ].forEach((testCaseToUnit: TestCaseToUnit) => {
      it(`should display ${testCaseToUnit.output} when input is ${testCaseToUnit.input}, inputUnit is '${testCaseToUnit.inputUnit}' and outputUnit is '${testCaseToUnit.outputUnit}'`, () => {
        expect(
          pipe
            .transform(
              testCaseToUnit.input,
              'DEFAULT',
              testCaseToUnit.outputUnit,
              testCaseToUnit.inputUnit,
            )
            .toString()
            .trim(),
        ).toBe(testCaseToUnit.output);
      });
    });
  });

  describe('Transform by precision mode', () => {
    describe('Precision Mode: PRECISE', () => {
      [
        {
          input: 500,
          outputUnit: DtTimeUnit.SECOND,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 'PRECISE',
          output: '0.5 s',
        },
        {
          input: 1234.5678,
          outputUnit: DtTimeUnit.SECOND,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 'PRECISE',
          output: '1.2345678 s',
        },
        {
          input: 1.6,
          outputUnit: DtTimeUnit.SECOND,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 'PRECISE',
          output: '0.002 s',
          maxDecimals: 3,
        },
        {
          input: 30000,
          outputUnit: DtTimeUnit.MINUTE,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 'PRECISE',
          output: '0.5 min',
        },
        {
          input: 135,
          outputUnit: DtTimeUnit.SECOND,
          inputUnit: DtTimeUnit.MINUTE,
          precision: 'PRECISE',
          output: '8100 s',
        },
        {
          input: 720000,
          outputUnit: DtTimeUnit.HOUR,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 'PRECISE',
          output: '0.2 h',
        },
        {
          input: -720000,
          outputUnit: DtTimeUnit.HOUR,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 'PRECISE',
          output: '-0.2 h',
        },
        {
          input: -500,
          outputUnit: DtTimeUnit.SECOND,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 'PRECISE',
          output: '-0.5 s',
        },
      ].forEach((testCasePrecision: TestCasePrecision) => {
        it(`should display ${testCasePrecision.output} when input is ${testCasePrecision.input}, inputUnit is '${testCasePrecision.inputUnit}', outputUnit is '${testCasePrecision.outputUnit}' and precision mode is ${testCasePrecision.precision}`, () => {
          expect(
            pipe
              .transform(
                testCasePrecision.input,
                'PRECISE',
                testCasePrecision.outputUnit,
                testCasePrecision.inputUnit,
                testCasePrecision.maxDecimals,
              )
              .toString()
              .trim(),
          ).toEqual(testCasePrecision.output);
        });
      });
    });

    describe('Precision Mode: CUSTOM (1-n)', () => {
      [
        {
          input: 450305005,
          outputUnit: undefined,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 5,
          output: '5 d 5 h 5 min 5 s 5 ms',
        },
        {
          input: 450305005,
          outputUnit: undefined,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 4,
          output: '5 d 5 h 5 min 5 s',
        },
        {
          input: 450305005,
          outputUnit: undefined,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 3,
          output: '5 d 5 h 5 min',
        },
        {
          input: 450305005,
          outputUnit: undefined,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 2,
          output: '5 d 5 h',
        },
        {
          input: 450305005,
          outputUnit: undefined,
          inputUnit: DtTimeUnit.MILLISECOND,
          precision: 1,
          output: '5 d',
        },
      ].forEach((testCaseCustom: TestCasePrecision) => {
        it(`should display ${testCaseCustom.output} when input is ${testCaseCustom.input}, inputUnit is '${testCaseCustom.inputUnit}', outputUnit is '${testCaseCustom.outputUnit}' and precision mode is '${testCaseCustom.precision}'`, () => {
          if (typeof testCaseCustom.precision === 'number') {
            expect(
              pipe
                .transform(
                  testCaseCustom.input,
                  testCaseCustom.precision,
                  testCaseCustom.outputUnit,
                  testCaseCustom.inputUnit,
                )
                .toString()
                .trim(),
            ).toEqual(testCaseCustom.output);
          }
        });
      });
    });
  });

  describe('Empty Values / Invalid Values', () => {
    it(`should return '${NO_DATA}' for empty values`, () => {
      expect(pipe.transform('', 'DEFAULT', undefined)).toEqual(NO_DATA);
      expect(pipe.transform(null, 'DEFAULT', undefined)).toEqual(NO_DATA);
      expect(pipe.transform(undefined, 'DEFAULT', undefined)).toEqual(NO_DATA);
    });
    it(`should return '${NO_DATA}' for values that cannot be converted to numbers`, () => {
      class A {}
      expect(pipe.transform([], 'DEFAULT', undefined)).toEqual(NO_DATA);
      expect(pipe.transform({}, 'DEFAULT', undefined)).toEqual(NO_DATA);
      expect(pipe.transform(() => {}, 'DEFAULT', undefined)).toEqual(NO_DATA);
      expect(pipe.transform(A, 'DEFAULT', undefined)).toEqual(NO_DATA);
      expect(pipe.transform(new A(), 'DEFAULT', undefined)).toEqual(NO_DATA);
    });
    it(`should return '${NO_DATA}' for combined strings`, () => {
      expect(pipe.transform('123test', 'DEFAULT', undefined)).toEqual(NO_DATA);
    });
  });

  describe('should handle 0 and negative numbers', () => {
    it('should handle 0', () => {
      expect(pipe.transform('0', 'DEFAULT', undefined).toString()).toEqual(
        '< 1 ms',
      );
    });
    it('should handle -1', () => {
      expect(pipe.transform('-1', 'DEFAULT', undefined).toString()).toEqual(
        '< 1 ms',
      );
    });
    it('should handle -123', () => {
      expect(pipe.transform('-123', 'DEFAULT', undefined).toString()).toEqual(
        '< 1 ms',
      );
    });
    it('should handle 0 with formatMode number', () => {
      expect(pipe.transform('0', 5, undefined).toString()).toEqual('0 ms');
    });
  });
});
