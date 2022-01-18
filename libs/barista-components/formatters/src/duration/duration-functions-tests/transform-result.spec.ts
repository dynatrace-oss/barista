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

import { dtTransformResult } from '../duration-formatter-utils';
import { DtTimeUnit } from '../../unit';
import { DurationMode, toDurationMode } from '../duration-formatter-constants';

describe('DtDurationFormatter', () => {
  interface Output {
    timeUnit: DtTimeUnit;
    duration: string;
  }

  interface TestCase {
    duration: number;
    inputUnit: DtTimeUnit;
    formatMethod: string | number;
    output: Output[];
    displayedOutput: string;
  }

  describe('dtTransformResult() Mode: DEFAULT', () => {
    [
      {
        duration: 1,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.MILLISECOND,
            duration: '1',
          },
        ],
        displayedOutput: '1 ms',
      },
      {
        duration: 1500,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.SECOND,
            duration: '1',
          },
          {
            timeUnit: DtTimeUnit.MILLISECOND,
            duration: '500',
          },
        ],
        displayedOutput: '1 s 500 ms',
      },
      {
        duration: 61500,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.MINUTE,
            duration: '1',
          },
          {
            timeUnit: DtTimeUnit.SECOND,
            duration: '1',
          },
          {
            timeUnit: DtTimeUnit.MILLISECOND,
            duration: '500',
          },
        ],
        displayedOutput: '1 min 1 s 500 ms',
      },
      {
        duration: 3601500,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.HOUR,
            duration: '1',
          },
          {
            timeUnit: DtTimeUnit.SECOND,
            duration: '1',
          },
        ],
        displayedOutput: '1 h 1 s',
      },
      {
        duration: 123456789,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.DAY,
            duration: '1',
          },
          {
            timeUnit: DtTimeUnit.HOUR,
            duration: '10',
          },
          {
            timeUnit: DtTimeUnit.MINUTE,
            duration: '17',
          },
        ],
        displayedOutput: '1 d 10 h 17 min',
      },
      {
        duration: 12.5,
        inputUnit: DtTimeUnit.HOUR,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.HOUR,
            duration: '12',
          },
          {
            timeUnit: DtTimeUnit.MINUTE,
            duration: '30',
          },
        ],
        displayedOutput: '12 h 30 min',
      },
      {
        duration: 10.111,
        inputUnit: DtTimeUnit.DAY,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.DAY,
            duration: '10',
          },
          {
            timeUnit: DtTimeUnit.HOUR,
            duration: '2',
          },
        ],
        displayedOutput: '10 d 2 h',
      },
      {
        duration: 100000000.1,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.DAY,
            duration: '1',
          },
        ],
        displayedOutput: '1 d',
      },
      {
        duration: 0.000001,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.NANOSECOND,
            duration: '1',
          },
        ],
        displayedOutput: '1 ns',
      },
      {
        duration: 0.001001,
        inputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        output: [
          {
            timeUnit: DtTimeUnit.MICROSECOND,
            duration: '1',
          },
          {
            timeUnit: DtTimeUnit.NANOSECOND,
            duration: '1',
          },
        ],
        displayedOutput: '1 µs 1 ns',
      },
    ].forEach((testCase: TestCase) => {
      it(`Duration '${testCase.duration}', input unit '${testCase.inputUnit}' should equal to '${testCase.displayedOutput}'`, () => {
        const formatMethod: DurationMode = toDurationMode(
          testCase.formatMethod,
        )!;
        const result = Array.from(
          dtTransformResult(
            testCase.duration,
            testCase.inputUnit,
            formatMethod,
          )!,
        );
        expect(result).not.toBeUndefined();
        testCase.output.forEach((output: Output, index) => {
          expect(result[index][0]).toBe(output.timeUnit);
          expect(result[index][1]).toBe(output.duration);
        });
      });
    });

    describe('dtTransformResult() Mode: Custom amount of units', () => {
      [
        {
          duration: 123456789,
          inputUnit: DtTimeUnit.MILLISECOND,
          formatMethod: 2,
          output: [
            {
              timeUnit: DtTimeUnit.DAY,
              duration: '1',
            },
            {
              timeUnit: DtTimeUnit.HOUR,
              duration: '10',
            },
          ],
          displayedOutput: '1 d 10',
        },
        {
          duration: 123456789,
          inputUnit: DtTimeUnit.MILLISECOND,
          formatMethod: 5,
          output: [
            {
              timeUnit: DtTimeUnit.DAY,
              duration: '1',
            },
            {
              timeUnit: DtTimeUnit.HOUR,
              duration: '10',
            },
            {
              timeUnit: DtTimeUnit.MINUTE,
              duration: '17',
            },
            {
              timeUnit: DtTimeUnit.SECOND,
              duration: '36',
            },
            {
              timeUnit: DtTimeUnit.MILLISECOND,
              duration: '789',
            },
          ],
          displayedOutput: '1 d 10 h 17 min 36 s 789 ms',
        },
      ].forEach((testCase: TestCase) => {
        it(`Duration '${testCase.duration}', input unit '${testCase.inputUnit}' should equal to '${testCase.displayedOutput}'`, () => {
          const formatMethod: DurationMode = toDurationMode(
            testCase.formatMethod,
          )!;
          const result = Array.from(
            dtTransformResult(
              testCase.duration,
              testCase.inputUnit,
              formatMethod,
            )!,
          );
          expect(result).not.toBeUndefined();
          testCase.output.forEach((output: Output, index) => {
            expect(result[index][0]).toBe(output.timeUnit);
            expect(result[index][1]).toBe(output.duration);
          });
        });
      });
    });
  });
});
