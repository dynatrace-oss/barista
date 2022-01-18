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
import { KILO_MULTIPLIER } from '../number-formatter';
import { DtUnit } from '../unit';
import { DtBits } from './bits';

describe('DtBits', () => {
  interface TestCase {
    input: number;
    factor?: number;
    inputUnit?: DtUnit;
    output: string;
  }

  let pipe: DtBits;

  beforeEach(() => {
    pipe = new DtBits();
  });

  describe('Transforming input without defined outputUnit', () => {
    [
      {
        input: 0,
        output: '0 bit',
      },
      {
        input: 1,
        output: '1 bit',
      },
      {
        input: 1000,
        output: '1 kbit',
      },
      {
        input: 20000000,
        output: '20 Mbit',
      },
      {
        input: 12500000000,
        output: '12.5 Gbit',
      },
      {
        input: 1250000000000,
        output: '1.25 Tbit',
      },
      {
        input: 7121000000000000,
        output: '7.12 Pbit',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} converted to auto unit`, () => {
        expect(pipe.transform(testCase.input).toString()).toEqual(
          testCase.output,
        );
      });
    });
  });

  describe('Transforming input with different input unit', () => {
    const testCases: TestCase[] = [
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.BITS,
        output: '1 kbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.KILO_BITS,
        output: '1 Mbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.MEGA_BITS,
        output: '1 Gbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.GIGA_BITS,
        output: '1 Tbit',
      },
      {
        input: 1000,
        factor: KILO_MULTIPLIER,
        inputUnit: DtUnit.TERA_BITS,
        output: '1 Pbit',
      },
    ];
    testCases.forEach((testCase: TestCase) => {
      it(`should display different result (${testCase.output})`, () => {
        expect(
          pipe
            .transform(testCase.input, testCase.factor, testCase.inputUnit)
            .toString(),
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
      expect(pipe.transform('123').toString()).toEqual('123 bit');
    });

    it('should handle 0', () => {
      expect(pipe.transform('0').toString()).toEqual('0 bit');
      expect(pipe.transform(0).toString()).toEqual('0 bit');
    });
  });
});
