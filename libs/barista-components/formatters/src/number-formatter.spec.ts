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

import { adjustNumber } from './number-formatter';

describe('FormatterUtil', () => {
  interface TestCase {
    input: number;
    output: string;
    maxPrecision?: number;
  }

  describe('Adjusting number without abbreviation', () => {
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
      {
        input: 0.0001,
        output: '< 0.001',
      },
      {
        input: -123.45,
        output: '-123',
      },
      {
        input: -10,
        output: '-10',
      },
      {
        input: -0.987654321,
        output: '-0.988',
      },
      {
        input: -0.0001,
        output: '-0.001',
      },
    ].forEach((testCase: TestCase) => {
      it(`should return ${testCase.input} with adjusted precision`, () => {
        expect(adjustNumber(testCase.input).toString()).toEqual(
          testCase.output,
        );
      });
    });
  });

  describe('Adjusting number with abbreviation', () => {
    [
      {
        input: 1234567890,
        output: '1.23bil',
      },
      {
        input: 123456789,
        output: '123mil',
      },
      {
        input: 12345678,
        output: '12.3mil',
      },
      {
        input: 1234567,
        output: '1.23mil',
      },
      {
        input: 123456,
        output: '123k',
      },
      {
        input: 12345,
        output: '12.3k',
      },
      {
        input: 1234,
        output: '1.23k',
      },
      {
        input: 123,
        output: '123',
      },
      {
        input: 0.1,
        output: '0.1',
      },
      {
        input: 0.0001,
        output: '< 0.001',
      },
      {
        input: -1234567890,
        output: '-1.23bil',
      },
      {
        input: -123456789,
        output: '-123mil',
      },
      {
        input: -12345678,
        output: '-12.3mil',
      },
      {
        input: -1234567,
        output: '-1.23mil',
      },
      {
        input: -123456,
        output: '-123k',
      },
      {
        input: -12345,
        output: '-12.3k',
      },
      {
        input: -1234,
        output: '-1.23k',
      },
      {
        input: -123,
        output: '-123',
      },
      {
        input: -12,
        output: '-12',
      },
      {
        input: -1,
        output: '-1',
      },
      {
        input: -0.0001,
        output: '-0.001',
      },
    ].forEach((testCase: TestCase) => {
      it(`should return ${testCase.input} in abbreviated version`, () => {
        expect(adjustNumber(testCase.input, true).toString()).toEqual(
          testCase.output,
        );
      });
    });
  });

  describe('Adjusting number with max precision set', () => {
    [
      {
        input: 0.123456789,
        maxPrecision: -1,
        output: '< 1',
      },
      {
        input: 1.123456789,
        maxPrecision: -1,
        output: '1',
      },
      {
        input: 0.123456789,
        output: '0.123',
      },
      {
        input: 0.123456789,
        maxPrecision: 0,
        output: '< 1',
      },
      {
        input: 0.123456789,
        maxPrecision: 1,
        output: '0.1',
      },
      {
        input: 0.123456789,
        maxPrecision: 2,
        output: '0.12',
      },
      {
        input: 0.123456789,
        maxPrecision: 3,
        output: '0.123',
      },
      {
        input: 0.123456789,
        maxPrecision: 4,
        output: '0.1235',
      },
      {
        input: 10.45,
        maxPrecision: 1,
        output: '10.5',
      },
      {
        input: 100.45,
        maxPrecision: 1,
        output: '100.5',
      },
      {
        input: 0.0001,
        output: '< 0.001',
      },
      {
        input: 0.0001,
        maxPrecision: 0,
        output: '< 1',
      },
      {
        input: 0.0001,
        maxPrecision: 1,
        output: '< 0.1',
      },
      {
        input: 0.0001,
        maxPrecision: 2,
        output: '< 0.01',
      },
      {
        input: -123.45,
        maxPrecision: 1,
        output: '-123.5',
      },
      {
        input: -123.45,
        maxPrecision: 2,
        output: '-123.45',
      },
      {
        input: -0.0001,
        maxPrecision: 3,
        output: '-0.001',
      },
    ].forEach((testCase: TestCase) => {
      it(`should return ${testCase.output} with input ${testCase.output} and max precision set to ${testCase.maxPrecision}`, () => {
        expect(
          adjustNumber(
            testCase.input,
            undefined,
            testCase.maxPrecision,
          ).toString(),
        ).toEqual(testCase.output);
      });
    });
  });
});
