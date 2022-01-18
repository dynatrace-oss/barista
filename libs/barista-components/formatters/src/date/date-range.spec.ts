/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

// Jest fails with this error:
// Note: This is a precaution to guard against uninitialized mock variables.
// If it is ensured that the mock is required lazily, variable names prefixed
// with `mock` (case insensitive) are permitted.
const mockLogger = {
  error: jest.fn(),
};

const loggerSpy = jest.spyOn(mockLogger, 'error');

// Mock needs to be done before importing from the module
jest.mock('@dynatrace/barista-components/core', () => ({
  DtLoggerFactory: {
    create: () => mockLogger,
  },
}));

import {
  DtDateRange,
  ERROR_MESSAGE_NO_NUMBERS_PROVIDED,
  ERROR_MESSAGE_WRONG_FORMAT,
  PLACEHOLDER,
} from './date-range';

describe('DtDateRange', () => {
  let pipe: DtDateRange;
  let spiedDate: any; // jest.SpyInstance;

  beforeEach(() => {
    pipe = new DtDateRange('en-US');
    spiedDate = jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() => new Date('2019/06/01 09:33:21').valueOf());
  });

  afterEach(() => {
    spiedDate.mockClear();
    loggerSpy.mockClear();
  });

  describe('Transforming date range with default en-US locale', () => {
    it('should transform an empty array to an empty string', () => {
      expect(pipe.transform([] as any).toString()).toEqual(PLACEHOLDER);
      expect(loggerSpy).toHaveBeenNthCalledWith(1, ERROR_MESSAGE_WRONG_FORMAT);
    });

    it('should transform to long or short arrays to an empty string', () => {
      expect(pipe.transform([1] as any).toString()).toEqual(PLACEHOLDER);
      expect(loggerSpy).toHaveBeenNthCalledWith(1, ERROR_MESSAGE_WRONG_FORMAT);
      expect(pipe.transform([1, 2, 3] as any).toString()).toEqual(PLACEHOLDER);
      expect(loggerSpy).toHaveBeenNthCalledWith(2, ERROR_MESSAGE_WRONG_FORMAT);
    });

    it('should log an error when the the array has no numbers', () => {
      const toBeTransformed = [NaN, NaN] as [number, number];

      const transformed = pipe.transform(toBeTransformed);

      expect(loggerSpy).toHaveBeenNthCalledWith(
        1,
        ERROR_MESSAGE_NO_NUMBERS_PROVIDED,
      );
      expect(transformed).toEqual(PLACEHOLDER);
    });

    it('should format two dates on the same day without a second day', () => {
      const start = new Date('2019/02/11 08:20:11').getTime();
      const end = new Date('2019/02/11 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        'Feb 11 08:20 — 10:20',
      );
    });

    it('should format two dates on the same year without a second year', () => {
      const start = new Date('2019/02/11 08:20:11').getTime();
      const end = new Date('2019/02/12 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        'Feb 11 08:20 — Feb 12 10:20',
      );
    });

    it('should format two dates on the same day in a different year with a leading year', () => {
      const start = new Date('2018/12/11 08:20:11').getTime();
      const end = new Date('2018/12/11 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        '2018 Dec 11 08:20 — 10:20',
      );
    });

    it('should format two dates on the same day in a different year with a leading year', () => {
      const start = new Date('2018/12/11 08:20:11').getTime();
      const end = new Date('2018/12/12 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        '2018 Dec 11 08:20 — Dec 12 10:20',
      );
    });

    it('should format two dates on the same day in a different year with a leading year', () => {
      const start = new Date('2017/02/11 08:20:11').getTime();
      const end = new Date('2018/12/12 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        '2017 Feb 11 08:20 — 2018 Dec 12 10:20',
      );
    });
  });
});
