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

import { dtConvertToUnit } from '../duration-formatter-utils';
import { DtTimeUnit } from '../../unit';

describe('DtDurationFormatter', () => {
  interface TestCase {
    duration: number;
    inputUnit: DtTimeUnit;
    output: number;
  }

  describe('dtConvertToUnit()', () => {
    [
      {
        duration: 1,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: 1000000,
      },
      {
        duration: 999.99,
        inputUnit: DtTimeUnit.MILLISECOND,
        output: 999990000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.SECOND,
        output: 1000000000,
      },
      {
        duration: 1.5,
        inputUnit: DtTimeUnit.SECOND,
        output: 1500000000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.MINUTE,
        output: 60000000000,
      },
      {
        duration: 0.5,
        inputUnit: DtTimeUnit.MINUTE,
        output: 30000000000,
      },
      {
        duration: 0.00005,
        inputUnit: DtTimeUnit.MINUTE,
        output: 3000000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.HOUR,
        output: 3600000000000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.DAY,
        output: 86400000000000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.MONTH,
        output: 2627999424000000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.YEAR,
        output: 31535993088000000,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: 1000,
      },
      {
        duration: 1000,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: 1000000,
      },
      {
        duration: 123.455,
        inputUnit: DtTimeUnit.MICROSECOND,
        output: 123455,
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 1,
      },
      {
        duration: 1000000,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 1000000,
      },
      {
        duration: 123.455,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 123.455,
      },
      {
        duration: -123.455,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: -123.455,
      },
      {
        duration: -0.001,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: -0.001,
      },
      {
        duration: -1,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: -1,
      },
      {
        duration: 0,
        inputUnit: DtTimeUnit.NANOSECOND,
        output: 0,
      },
    ].forEach((testCase: TestCase) => {
      it(`Duration '${testCase.duration}', input unit '${testCase.inputUnit}' should equal to '${testCase.output}'`, () => {
        expect(dtConvertToUnit(testCase.duration, testCase.inputUnit)).toBe(
          testCase.output,
        );
      });
    });
  });
});
