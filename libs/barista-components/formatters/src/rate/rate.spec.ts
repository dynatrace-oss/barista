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

import { DtBytes } from '../bytes/bytes';
import { NO_DATA } from '../formatted-value';
import { DtRateUnit } from '../unit';
import { DtRate } from './rate';

describe('DtRate', () => {
  interface TestCase {
    input: number;
    rateUnit: DtRateUnit | string;
    inputRateUnit?: DtRateUnit;
    output: string;
  }

  let ratePipe: DtRate;
  let bytePipe: DtBytes;
  beforeEach(() => {
    ratePipe = new DtRate();
    bytePipe = new DtBytes();
  });

  describe('Transforming input of type number', () => {
    [
      {
        input: 10,
        rateUnit: DtRateUnit.PER_MINUTE,
        output: '10 /min',
      },
      {
        input: 200,
        rateUnit: DtRateUnit.PER_SECOND,
        output: '200 /s',
      },
      {
        input: 3000,
        rateUnit: 'request',
        output: '3000 /request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} without unit`, () => {
        expect(
          ratePipe.transform(testCase.input, testCase.rateUnit).toString(),
        ).toEqual(testCase.output);
      });
    });
  });

  describe('Transforming input of type DtFormattedValue', () => {
    [
      {
        input: 10,
        rateUnit: DtRateUnit.PER_MINUTE,
        output: '10 B/min',
      },
      {
        input: 200,
        rateUnit: DtRateUnit.PER_SECOND,
        output: '200 B/s',
      },
      {
        input: 3000,
        rateUnit: 'request',
        output: '3 kB/request',
      },
    ].forEach((testCase: TestCase) => {
      it(`should display ${testCase.input} orignal unit together with rate`, () => {
        const formattedValue = bytePipe.transform(testCase.input);
        expect(
          ratePipe.transform(formattedValue, testCase.rateUnit).toString(),
        ).toEqual(testCase.output);
      });
    });
  });

  describe('Empty values / Invalid values', () => {
    it(`should return '${NO_DATA}' for empty values`, () => {
      expect(ratePipe.transform('', DtRateUnit.PER_SECOND)).toEqual(NO_DATA);
      expect(ratePipe.transform(null, DtRateUnit.PER_SECOND)).toEqual(NO_DATA);
      expect(ratePipe.transform(undefined, DtRateUnit.PER_SECOND)).toEqual(
        NO_DATA,
      );
    });

    it(`should return '${NO_DATA}' for values that cannot be converted to numbers`, () => {
      class A {}
      expect(ratePipe.transform({}, DtRateUnit.PER_SECOND)).toEqual(NO_DATA);
      expect(ratePipe.transform([], DtRateUnit.PER_SECOND)).toEqual(NO_DATA);
      expect(ratePipe.transform(() => {}, DtRateUnit.PER_SECOND)).toEqual(
        NO_DATA,
      );
      expect(ratePipe.transform(A, DtRateUnit.PER_SECOND)).toEqual(NO_DATA);
      expect(ratePipe.transform(new A(), DtRateUnit.PER_SECOND)).toEqual(
        NO_DATA,
      );
    });

    it(`should return '${NO_DATA}' for combined strings`, () => {
      expect(
        ratePipe.transform('123test', DtRateUnit.PER_SECOND).toString(),
      ).toEqual(NO_DATA);
    });
  });

  describe('Valid input types', () => {
    it('should handle numbers as strings', () => {
      expect(
        ratePipe.transform('123', DtRateUnit.PER_SECOND).toString(),
      ).toEqual('123 /s');
      expect(
        ratePipe.transform('1234', DtRateUnit.PER_SECOND).toString(),
      ).toEqual('1234 /s');
    });

    it('should handle 0', () => {
      expect(ratePipe.transform('0', DtRateUnit.PER_SECOND).toString()).toEqual(
        '0 /s',
      );
      expect(ratePipe.transform(0, DtRateUnit.PER_SECOND).toString()).toEqual(
        '0 /s',
      );
    });
  });
});
