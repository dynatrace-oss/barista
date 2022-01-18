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

import { DtTimeUnit } from '../../unit';
import { toDurationMode } from '../duration-formatter-constants';
import { dtTransformResultPrecise } from '../duration-formatter-utils';

describe('DtDurationFormatter', () => {
  interface Output {
    timeUnit: DtTimeUnit;
    duration: string;
  }

  interface TestCase {
    duration: number;
    inputUnit: DtTimeUnit;
    outputUnit: DtTimeUnit;
    formatMethod: string;
    outPut: Output[];
    displayedOutPut: string;
    maxDecimals?: number;
  }

  describe('dtTransformResultPrecise() Mode: OutputUnit', () => {
    [
      {
        duration: 1,
        inputUnit: DtTimeUnit.MILLISECOND,
        outputUnit: DtTimeUnit.MILLISECOND,
        formatMethod: 'DEFAULT',
        outPut: [
          {
            timeUnit: DtTimeUnit.MILLISECOND,
            duration: '1',
          },
        ],
        displayedOutPut: '1 ms',
      },
      {
        duration: 1500,
        inputUnit: DtTimeUnit.MILLISECOND,
        outputUnit: DtTimeUnit.SECOND,
        formatMethod: 'DEFAULT',
        outPut: [
          {
            timeUnit: DtTimeUnit.SECOND,
            duration: '1',
          },
        ],
        displayedOutPut: '1 s',
      },
      {
        duration: 150000001,
        inputUnit: DtTimeUnit.MILLISECOND,
        outputUnit: DtTimeUnit.SECOND,
        formatMethod: 'DEFAULT',
        outPut: [
          {
            timeUnit: DtTimeUnit.SECOND,
            duration: '150000',
          },
        ],
        displayedOutPut: '150000 s',
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.HOUR,
        outputUnit: DtTimeUnit.SECOND,
        formatMethod: 'DEFAULT',
        outPut: [
          {
            timeUnit: DtTimeUnit.SECOND,
            duration: '3600',
          },
        ],
        displayedOutPut: '3600 s',
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.NANOSECOND,
        outputUnit: DtTimeUnit.YEAR,
        formatMethod: 'DEFAULT',
        outPut: [
          {
            timeUnit: DtTimeUnit.YEAR,
            duration: '< 1',
          },
        ],
        displayedOutPut: '1 y',
      },
      {
        duration: 999,
        inputUnit: DtTimeUnit.MILLISECOND,
        outputUnit: DtTimeUnit.SECOND,
        formatMethod: 'DEFAULT',
        outPut: [
          {
            timeUnit: DtTimeUnit.SECOND,
            duration: '< 1',
          },
        ],
        displayedOutPut: '1 s',
      },
      {
        duration: 1,
        inputUnit: DtTimeUnit.MONTH,
        outputUnit: DtTimeUnit.YEAR,
        formatMethod: 'DEFAULT',
        outPut: [
          {
            timeUnit: DtTimeUnit.YEAR,
            duration: '< 1',
          },
        ],
        displayedOutPut: '1 y',
      },
    ].forEach((testCase: TestCase) => {
      it(`Duration '${testCase.duration}', input unit '${testCase.inputUnit}' should equal to '${testCase.displayedOutPut}'`, () => {
        const formatMethod = toDurationMode(testCase.formatMethod)!;
        const result = Array.from(
          dtTransformResultPrecise(
            testCase.duration,
            testCase.inputUnit,
            testCase.outputUnit,
            formatMethod,
          )!,
        );
        testCase.outPut.forEach((output: Output, index) => {
          expect(result[index]).toContain(output.timeUnit);
          expect(result[index]).toContain(output.duration);
        });
      });
    });

    describe('dtTransformResultPrecise() Mode: Precise + Output Unit', () => {
      [
        {
          duration: 1500,
          inputUnit: DtTimeUnit.MILLISECOND,
          outputUnit: DtTimeUnit.MILLISECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.MILLISECOND,
              duration: '1500',
            },
          ],
          displayedOutPut: '1500 ms',
        },
        {
          duration: 1500,
          inputUnit: DtTimeUnit.MILLISECOND,
          outputUnit: DtTimeUnit.SECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.SECOND,
              duration: '1.5',
            },
          ],
          displayedOutPut: '1.5 s',
        },
        {
          duration: 1.234569,
          inputUnit: DtTimeUnit.SECOND,
          outputUnit: DtTimeUnit.MILLISECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.MILLISECOND,
              duration: '1234.569',
            },
          ],
          displayedOutPut: '1234.569 ms',
        },
        {
          duration: 12.525,
          inputUnit: DtTimeUnit.MINUTE,
          outputUnit: DtTimeUnit.HOUR,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.HOUR,
              duration: '0.20875',
            },
          ],
          displayedOutPut: '0.20875 h',
        },
        {
          duration: 123.4569,
          inputUnit: DtTimeUnit.HOUR,
          outputUnit: DtTimeUnit.SECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.SECOND,
              duration: '444444.84',
            },
          ],
          displayedOutPut: '444444.84 s',
        },
        {
          duration: 1234.569,
          inputUnit: DtTimeUnit.DAY,
          outputUnit: DtTimeUnit.HOUR,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.HOUR,
              duration: '29629.656',
            },
          ],
          displayedOutPut: '29629.656 h',
        },
        {
          duration: 1234.569,
          inputUnit: DtTimeUnit.DAY,
          outputUnit: DtTimeUnit.HOUR,
          formatMethod: 'PRECISE',
          maxDecimals: 2,
          outPut: [
            {
              timeUnit: DtTimeUnit.HOUR,
              duration: '29629.66',
            },
          ],
          displayedOutPut: '29629.66 h',
        },
        {
          duration: 12345.5,
          inputUnit: DtTimeUnit.MILLISECOND,
          outputUnit: DtTimeUnit.MICROSECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.MICROSECOND,
              duration: '12345500',
            },
          ],
          displayedOutPut: '123455000 µs',
        },
        {
          duration: 12345.5,
          inputUnit: DtTimeUnit.MILLISECOND,
          outputUnit: DtTimeUnit.NANOSECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.NANOSECOND,
              duration: '12345500000',
            },
          ],
          displayedOutPut: '12345500000 ns',
        },
        {
          duration: 1,
          inputUnit: DtTimeUnit.MILLISECOND,
          outputUnit: DtTimeUnit.MICROSECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.MICROSECOND,
              duration: '1000',
            },
          ],
          displayedOutPut: '1000 µs',
        },
        {
          duration: 1,
          inputUnit: DtTimeUnit.MILLISECOND,
          outputUnit: DtTimeUnit.NANOSECOND,
          formatMethod: 'PRECISE',
          outPut: [
            {
              timeUnit: DtTimeUnit.NANOSECOND,
              duration: '1000000',
            },
          ],
          displayedOutPut: '1000000 ns',
        },
      ].forEach((testCase: TestCase) => {
        it(`Duration '${testCase.duration}', input unit '${testCase.inputUnit}' should equal to '${testCase.displayedOutPut}'`, () => {
          const formatMethod = toDurationMode(testCase.formatMethod)!;
          const result = Array.from(
            dtTransformResultPrecise(
              testCase.duration,
              testCase.inputUnit,
              testCase.outputUnit,
              formatMethod,
              testCase.maxDecimals,
            )!,
          );
          testCase.outPut.forEach((output: Output, index) => {
            expect(result[index]).toContain(output.timeUnit);
            expect(result[index]).toContain(output.duration);
          });
        });
      });
    });
  });
});
