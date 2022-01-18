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
import { DtPercent } from './percent';

describe('DtPercentPipe', () => {
  interface TestCase {
    input: number;
    output: string;
  }

  let pipe: DtPercent;

  beforeEach(() => {
    pipe = new DtPercent();
  });

  describe('Transforming input', () => {
    [
      {
        input: 0.123456789,
        output: '0.123 %',
      },
      {
        input: 1.23456789,
        output: '1.23 %',
      },
      {
        input: 12.3456789,
        output: '12.3 %',
      },
      {
        input: 123.456789,
        output: '123 %',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} with adjusted precision and % sign`, () => {
        expect(pipe.transform(testCase.input).toString()).toEqual(
          testCase.output,
        );
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
      expect(pipe.transform('123').toString()).toEqual('123 %');
      expect(pipe.transform('1234').toString()).toEqual('1,234 %');
    });

    it('should handle 0', () => {
      expect(pipe.transform('0').toString()).toEqual('0 %');
      expect(pipe.transform(0).toString()).toEqual('0 %');
    });
  });
});
