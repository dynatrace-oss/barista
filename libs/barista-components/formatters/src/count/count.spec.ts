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

import { NO_DATA } from '../formatted-value';
import { DtUnit } from '../unit';
import { DtCount } from './count';

describe('DtCount', () => {
  interface TestCase {
    input: number;
    inputUnit: DtUnit | string;
    maxPrecision?: number;
    output: string;
  }

  let pipe: DtCount;

  beforeEach(() => {
    pipe = new DtCount();
  });

  describe('Transforming input with default input unit', () => {
    [
      {
        input: 10000,
        inputUnit: DtUnit.COUNT,
        output: '10k',
      },
      {
        input: 20000000,
        inputUnit: DtUnit.COUNT,
        output: '20mil',
      },
      {
        input: 3000000000,
        inputUnit: DtUnit.COUNT,
        output: '3bil',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} without unit`, () => {
        expect(
          pipe.transform(testCase.input, testCase.inputUnit).toString(),
        ).toEqual(testCase.output);
      });
    });
  });

  describe('Transforming input with custom input unit', () => {
    [
      {
        input: 10000,
        inputUnit: 'req.',
        output: '10k req.',
      },
      {
        input: 20000000,
        inputUnit: 'host units',
        output: '20mil host units',
      },
      {
        input: 3000000000,
        inputUnit: 'u.',
        output: '3bil u.',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} together with custom unit`, () => {
        expect(
          pipe.transform(testCase.input, testCase.inputUnit).toString(),
        ).toEqual(testCase.output);
      });
    });
  });

  describe('Empty values / Invalid values', () => {
    it(`should return '${NO_DATA}' for empty values`, () => {
      expect(pipe.transform('')).toEqual(NO_DATA);
      expect(pipe.transform(null)).toEqual(NO_DATA);
      expect(pipe.transform(undefined)).toEqual(NO_DATA);
    });

    it(`should return '${NO_DATA}' for values that cannot be converted to numbers`, () => {
      class A {}
      expect(pipe.transform({})).toEqual(NO_DATA);
      expect(pipe.transform([])).toEqual(NO_DATA);
      expect(pipe.transform(() => {})).toEqual(NO_DATA);
      expect(pipe.transform(A)).toEqual(NO_DATA);
      expect(pipe.transform(new A())).toEqual(NO_DATA);
    });

    it(`should return '${NO_DATA}' for combined strings`, () => {
      expect(pipe.transform('123test').toString()).toEqual(NO_DATA);
    });
  });

  describe('Valid input types', () => {
    it('should handle numbers as strings', () => {
      expect(pipe.transform('123').toString()).toEqual('123');
      expect(pipe.transform('1234').toString()).toEqual('1.23k');
    });

    it('should handle 0', () => {
      expect(pipe.transform('0').toString()).toEqual('0');
      expect(pipe.transform(0).toString()).toEqual('0');
    });
  });

  describe('Transforming input with max precision', () => {
    [
      {
        input: 0.50234,
        inputUnit: DtUnit.COUNT,
        maxPrecision: 0,
        output: '< 1',
      },
      {
        input: 1.50234,
        inputUnit: DtUnit.COUNT,
        maxPrecision: 0,
        output: '2',
      },
      {
        input: 20000001,
        inputUnit: DtUnit.COUNT,
        maxPrecision: 0,
        output: '20mil',
      },
      {
        input: 0.50234,
        inputUnit: DtUnit.COUNT,
        maxPrecision: 5,
        output: '0.50234',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} without unit`, () => {
        expect(
          pipe
            .transform(
              testCase.input,
              testCase.inputUnit,
              testCase.maxPrecision,
            )
            .toString(),
        ).toEqual(testCase.output);
      });
    });
  });
});
