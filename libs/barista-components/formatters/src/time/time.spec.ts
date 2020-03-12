/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

// tslint:disable: no-magic-numbers
import { NO_DATA } from '../formatted-value';
import { DtTimeUnit } from '../unit';
import { DtTime } from './time';

describe('DtTimePipe', () => {
  interface TestCase {
    input: number;
    inputFormat: DtTimeUnit | undefined;
    output: string;
  }

  interface TestCaseToUnit {
    input: number;
    inputFormat: DtTimeUnit | undefined;
    toUnit: DtTimeUnit;
    output: string;
  }

  let pipe: DtTime;

  beforeEach(() => {
    pipe = new DtTime();
  });

  describe('Transforming input', () => {
    [
      {
        input: 1,
        inputFormat: undefined,
        output: '1ms',
      },
      {
        input: 12 * 30.4 * 24 * 60 * 60 * 1000 + 7,
        inputFormat: undefined,
        output: '1y',
      },
      {
        input: 30.4 * 24 * 60 * 60 * 1000,
        inputFormat: undefined,
        output: '1mo',
      },
      {
        input: 24 * 60 * 60 * 1000,
        inputFormat: undefined,
        output: '1d',
      },
      {
        input: 1.5,
        inputFormat: DtTimeUnit.MONTH,
        output: '1mo 15d',
      },
      {
        input: 1.5,
        inputFormat: DtTimeUnit.HOUR,
        output: '1h 30min',
      },
      {
        input: 1.5,
        inputFormat: DtTimeUnit.MINUTE,
        output: '1min 30s',
      },
      {
        input: 1.5,
        inputFormat: DtTimeUnit.SECOND,
        output: '1s 500ms',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.output} when input is ${testCase.input}`, () => {
        expect(
          pipe
            .transform(testCase.input, testCase.inputFormat, undefined)
            .toString()
            .trim(),
        ).toBe(testCase.output);
      });
    });
  });
  describe('Transforming input with toUnit parameter set', () => {
    [
      {
        input: 1.234567,
        inputFormat: DtTimeUnit.DAY,
        toUnit: DtTimeUnit.SECOND,
        output: '1d 5h 37min 46s',
      },
      {
        input: 1.234567,
        inputFormat: DtTimeUnit.DAY,
        toUnit: DtTimeUnit.HOUR,
        output: '1d 5h',
      },
      {
        input: 1.234567,
        inputFormat: DtTimeUnit.DAY,
        toUnit: DtTimeUnit.MINUTE,
        output: '1d 5h 37min',
      },
      {
        input: 1.234567,
        inputFormat: DtTimeUnit.DAY,
        // should disregard at toUnit set higher than the inputUnit and output three time units
        toUnit: DtTimeUnit.YEAR,
        output: '1d 5h',
      },
    ].forEach((testCaseToUnit: TestCaseToUnit) => {
      it(`should display ${testCaseToUnit.output} when input is ${testCaseToUnit.input} and toUnit is set to ${testCaseToUnit.toUnit}`, () => {
        expect(
          pipe
            .transform(
              testCaseToUnit.input,
              testCaseToUnit.inputFormat,
              testCaseToUnit.toUnit,
            )
            .toString()
            .trim(),
        ).toBe(testCaseToUnit.output);
      });
    });
  });
  describe('Empty Values / Invalid Values', () => {
    it(`should return '${NO_DATA}' for empty values`, () => {
      expect(pipe.transform('', undefined, undefined)).toEqual(NO_DATA);
      expect(pipe.transform(null, undefined, undefined)).toEqual(NO_DATA);
      expect(pipe.transform(undefined, undefined, undefined)).toEqual(NO_DATA);
    });
    it(`should return '${NO_DATA}' for values that cannot be converted to numbers`, () => {
      class A {}
      expect(pipe.transform([], undefined, undefined)).toEqual(NO_DATA);
      expect(pipe.transform({}, undefined, undefined)).toEqual(NO_DATA);
      expect(pipe.transform(() => {}, undefined, undefined)).toEqual(NO_DATA);
      expect(pipe.transform(A, undefined, undefined)).toEqual(NO_DATA);
      expect(pipe.transform(new A(), undefined, undefined)).toEqual(NO_DATA);
    });
    it(`should return '${NO_DATA}' for combined strings`, () => {
      expect(pipe.transform('123test', undefined, undefined)).toEqual(NO_DATA);
    });
  });
  describe('should handle 0 and negative numbers', () => {
    it('should handle 0', () => {
      expect(pipe.transform('0', undefined, undefined).toString()).toEqual(
        '0 ms',
      );
    });
    it('should handle -1', () => {
      expect(pipe.transform('-1', undefined, undefined).toString()).toEqual(
        '0 ms',
      );
    });
    it('should handle -123', () => {
      expect(pipe.transform('-123', undefined, undefined).toString()).toEqual(
        '0 ms',
      );
    });
  });
});
