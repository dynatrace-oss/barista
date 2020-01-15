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

import { dtConvertToMilliseconds } from '../duration-formatter-utils';
import { DtTimeUnit } from '../../unit';

describe('DtDurationFormatter', () => {
  interface TestCase {
    duration: number;
    inputUnit: DtTimeUnit;
    output: number;
  }

  describe('dtConvertToMilliseconds()', () => {
    [
      {
        duration: 1,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: 1,
      },
      {
        duration: 999.99,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: 999.99,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.SECOND,
        output: 1000,
      },
      {
        duration: 1.5,
        inputUnit: DtTimeUnit.SECOND,
        output: 1500,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.MINUTE,
        output: 60000,
      },
      {
        duration: 0.5,
        inputUnit: DtTimeUnit.MINUTE,
        output: 30000,
      },
      {
        duration: 0.00005,
        inputUnit: DtTimeUnit.MINUTE,
        output: 3,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.HOUR,
        output: 3600000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.DAY,
        output: 86400000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.MONTH,
        output: 2627999423.9999995,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.YEAR,
        output: 31535993088,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: 0.001,
      },
      {
        duration: 1000,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: 1,
      },
      {
        duration: 123.455,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: 0.123455,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 0.000001,
      },
      {
        duration: 1000000,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 1,
      },
      {
        duration: 123.455,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 0.000123455,
      },
      {
        duration: -123.455,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: undefined,
      },
      {
        duration: -0.001,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: undefined,
      },
      {
        duration: -1,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: undefined,
      },
      {
        duration: 0,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 0,
      },
    ].forEach((testCase: TestCase) => {
      it(`Duration '${testCase.duration}', input unit '${testCase.inputUnit}' should equal to '${testCase.output}'`, () => {
        expect(
          dtConvertToMilliseconds(testCase.duration, testCase.inputUnit),
        ).toBe(testCase.output);
      });
    });
  });
});
