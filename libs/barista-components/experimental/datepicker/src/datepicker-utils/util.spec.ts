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

import {
  valueTo2DigitString,
  isValidHour,
  isValidMinute,
  isValid,
  isPastedTimeValid,
  isOutsideMinMaxRange,
  hasMininmumTwoDigits,
} from './util';
import { DtNativeDateAdapter } from '@dynatrace/barista-components/core';

describe('timeinput', () => {
  describe('valueTo2DigitString', () => {
    it('should cast a number value to string', () => {
      expect(valueTo2DigitString(15)).toBe('15');
      expect(valueTo2DigitString(20)).toBe('20');
    });
    it('should prepend zeros for numbers smaller than 10', () => {
      expect(valueTo2DigitString(0)).toBe('00');
      expect(valueTo2DigitString(8)).toBe('08');
    });
  });

  describe('hasMininmumTwoDigits', () => {
    it('should return true if a number with at least two digits is passed in', () => {
      expect(hasMininmumTwoDigits(15)).toBeTruthy();
      expect(hasMininmumTwoDigits(20)).toBeTruthy();
      expect(hasMininmumTwoDigits(123)).toBeTruthy();
    });
    it('should return false if a number with less than two digits is passed in', () => {
      expect(hasMininmumTwoDigits(5)).toBeFalsy();
      expect(hasMininmumTwoDigits(2)).toBeFalsy();
      expect(hasMininmumTwoDigits(0)).toBeFalsy();
    });
    it('should return true if a string representing a number with at least two digits is passed in (e.g. if there is a leading 0)', () => {
      expect(hasMininmumTwoDigits('15')).toBeTruthy();
      expect(hasMininmumTwoDigits('20')).toBeTruthy();
      expect(hasMininmumTwoDigits('02')).toBeTruthy();
      expect(hasMininmumTwoDigits('05')).toBeTruthy();
      expect(hasMininmumTwoDigits('00')).toBeTruthy();
    });
    it('should return false if a string representing a number with less than two digits is passed in', () => {
      expect(hasMininmumTwoDigits('5')).toBeFalsy();
      expect(hasMininmumTwoDigits('2')).toBeFalsy();
      expect(hasMininmumTwoDigits('0')).toBeFalsy();
    });
    it('should return false if empty values are passed in', () => {
      expect(hasMininmumTwoDigits('')).toBeFalsy();
      expect(hasMininmumTwoDigits(' ')).toBeFalsy();
      expect(hasMininmumTwoDigits('  ')).toBeFalsy();
      expect(hasMininmumTwoDigits(null)).toBeFalsy();
    });
  });

  describe('isOutsideMinMaxRange', () => {
    const dateAdapter = new DtNativeDateAdapter();
    it('should return true if a date earlier than the minDate is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2010, 1, 1),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 1, 1),
          dateAdapter,
          new Date(2015, 1, 2),
          new Date(2015, 11, 11),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2014, 11, 11),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeTruthy();
    });
    it('should return false if a date equal to the minDate or maxDate is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 1, 1),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 11, 11),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeFalsy();
    });
    it('should return false if minDate and maxDate are equal and a date equal to them is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 1, 1),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 1, 1),
        ),
      ).toBeFalsy();
    });
    it('should return true if minDate and maxDate are equal and any other date is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 1, 2),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 1, 1),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 11, 12),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 1, 1),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 5, 7),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 1, 1),
        ),
      ).toBeTruthy();
    });
    it('should return false if a date within range is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 5, 5),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 1, 2),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 11, 10),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeFalsy();
    });
    it('should return true if a date later than the maxDate is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 1, 1),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2016, 1, 1),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 11),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2015, 11, 11),
          dateAdapter,
          new Date(2015, 1, 1),
          new Date(2015, 11, 10),
        ),
      ).toBeTruthy();
    });
    it('should return false if minDate and maxDate are null and any date is passed in', () => {
      expect(
        isOutsideMinMaxRange(new Date(2020, 1, 1), dateAdapter),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(new Date(1900, 1, 1), dateAdapter),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(new Date(20160, 1, 1), dateAdapter),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(new Date(11, 11, 11), dateAdapter),
      ).toBeFalsy();
    });
    it('should return false if minDate is null and a date less or equal to maxDate is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 1, 1),
          dateAdapter,
          null,
          new Date(2020, 11, 11),
        ),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 11, 10),
          dateAdapter,
          null,
          new Date(2020, 11, 11),
        ),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 11, 11),
          dateAdapter,
          null,
          new Date(2020, 11, 11),
        ),
      ).toBeFalsy();
    });
    it('should return true if minDate is null and a date greater than maxDate is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2021, 11, 11),
          dateAdapter,
          null,
          new Date(2020, 11, 11),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 11, 12),
          dateAdapter,
          null,
          new Date(2020, 11, 11),
        ),
      ).toBeTruthy();
    });
    it('should return false if maxDate is null and a date greater or equal to minDate is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2021, 1, 1),
          dateAdapter,
          new Date(2020, 11, 11),
        ),
      ).toBeFalsy();
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 11, 11),
          dateAdapter,
          new Date(2020, 11, 11),
        ),
      ).toBeFalsy();
    });
    it('should return true if maxDate is null and a date less than minDate is passed in', () => {
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 10, 11),
          dateAdapter,
          new Date(2020, 11, 11),
        ),
      ).toBeTruthy();
      expect(
        isOutsideMinMaxRange(
          new Date(2020, 11, 10),
          dateAdapter,
          new Date(2020, 11, 11),
        ),
      ).toBeTruthy();
    });
  });

  describe('isValidHour', () => {
    it('should return true with an integer between 0 and 23', () => {
      expect(isValidHour(0)).toBeTruthy();
      expect(isValidHour(10)).toBeTruthy();
      expect(isValidHour(12)).toBeTruthy();
      expect(isValidHour(23)).toBeTruthy();
    });
    it('should return true with a string representing an integer between 0 and 23', () => {
      expect(isValidHour('0')).toBeTruthy();
      expect(isValidHour('00')).toBeTruthy();
      expect(isValidHour('10')).toBeTruthy();
      expect(isValidHour('12')).toBeTruthy();
      expect(isValidHour('23')).toBeTruthy();
    });
    it('should return false with a float', () => {
      expect(isValidHour(0.3)).toBeFalsy();
      expect(isValidHour(5.1)).toBeFalsy();
      expect(isValidHour(20.1)).toBeFalsy();
      expect(isValidHour(-5.1)).toBeFalsy();
      expect(isValidHour(-5.0)).toBeFalsy();
      expect(isValidHour(35.0)).toBeFalsy();
      expect(isValidHour(35.1)).toBeFalsy();
    });
    it('should return false with a string representing a float', () => {
      expect(isValidHour('0.3')).toBeFalsy();
      expect(isValidHour('-5.1')).toBeFalsy();
      expect(isValidHour('5.0')).toBeFalsy();
    });
    it('should return false with an integer outside the valid range', () => {
      expect(isValidHour(-1)).toBeFalsy();
      expect(isValidHour(24)).toBeFalsy();
      expect(isValidHour(25)).toBeFalsy();
    });
    it('should return false with a string representing an integer outside the valid range or with invalid leading zeros', () => {
      expect(isValidHour('0000008')).toBeFalsy();
      expect(isValidHour('005')).toBeFalsy();
      expect(isValidHour('25')).toBeFalsy();
      expect(isValidHour('-1')).toBeFalsy();
    });
  });

  describe('isValidMinute', () => {
    it('should return true with an integer between 0 and 59', () => {
      expect(isValidMinute(0)).toBeTruthy();
      expect(isValidMinute(10)).toBeTruthy();
      expect(isValidMinute(12)).toBeTruthy();
      expect(isValidMinute(23)).toBeTruthy();
      expect(isValidMinute(59)).toBeTruthy();
    });
    it('should return true with a string representing an integer between 0 and 59', () => {
      expect(isValidMinute('0')).toBeTruthy();
      expect(isValidMinute('00')).toBeTruthy();
      expect(isValidMinute('20')).toBeTruthy();
      expect(isValidMinute('45')).toBeTruthy();
      expect(isValidMinute('59')).toBeTruthy();
    });
    it('should return false with a float', () => {
      expect(isValidMinute(-5.1)).toBeFalsy();
      expect(isValidMinute(-5.0)).toBeFalsy();
      expect(isValidMinute(0.3)).toBeFalsy();
      expect(isValidMinute(5.1)).toBeFalsy();
      expect(isValidMinute(20.1)).toBeFalsy();
      expect(isValidMinute(50.1)).toBeFalsy();
      expect(isValidMinute(65.1)).toBeFalsy();
    });
    it('should return false with a string representing a float', () => {
      expect(isValidMinute('0.3')).toBeFalsy();
      expect(isValidMinute('5.0')).toBeFalsy();
      expect(isValidMinute('15.0')).toBeFalsy();
      expect(isValidMinute('25.0')).toBeFalsy();
      expect(isValidMinute('66.0')).toBeFalsy();
    });
    it('should return false with an integer outside the valid range', () => {
      expect(isValidMinute(-1)).toBeFalsy();
      expect(isValidMinute(60)).toBeFalsy();
      expect(isValidMinute(75)).toBeFalsy();
    });
    it('should return false with a string representing an integer outside the valid range or with invalid leading zeros', () => {
      expect(isValidMinute('-1')).toBeFalsy();
      expect(isValidMinute('0000008')).toBeFalsy();
      expect(isValidMinute('005')).toBeFalsy();
      expect(isValidMinute('65')).toBeFalsy();
      expect(isValidMinute('75')).toBeFalsy();
    });
  });

  describe('isValid', () => {
    it('should return false with an empty input', () => {
      expect(isValid('', -Infinity, Infinity)).toBeFalsy();
      expect(isValid(' ', -Infinity, Infinity)).toBeFalsy();
      expect(isValid('NaN', -Infinity, Infinity)).toBeFalsy();
      expect(isValid(null, -Infinity, Infinity)).toBeFalsy();
      expect(isValid(undefined, -Infinity, Infinity)).toBeFalsy();
    });
    it('should return false with invalid inputs containing special characters - or +', () => {
      expect(isValid('-1', -Infinity, Infinity)).toBeFalsy();
      expect(isValid('+1', -Infinity, Infinity)).toBeFalsy();
      expect(isValid('1+1', -Infinity, Infinity)).toBeFalsy();
      expect(isValid('0-0', -Infinity, Infinity)).toBeFalsy();
    });
  });

  describe('isPastedTimeValid', () => {
    it('should return true if a valid hh:mm value is passed', () => {
      expect(isPastedTimeValid('00:00')).toBeTruthy();
      expect(isPastedTimeValid('00:23')).toBeTruthy();
      expect(isPastedTimeValid('01:02')).toBeTruthy();
      expect(isPastedTimeValid('1:2')).toBeTruthy();
      expect(isPastedTimeValid('15:23')).toBeTruthy();
      expect(isPastedTimeValid('20:59')).toBeTruthy();
    });
    it('should return false if an invalid hh:mm value is passed', () => {
      expect(isPastedTimeValid('29:23')).toBeFalsy();
      expect(isPastedTimeValid('10:66')).toBeFalsy();
      expect(isPastedTimeValid('24:66')).toBeFalsy();
      expect(isPastedTimeValid('02:60')).toBeFalsy();
      expect(isPastedTimeValid('12;23')).toBeFalsy();
      expect(isPastedTimeValid('12-23')).toBeFalsy();
      expect(isPastedTimeValid('12.23')).toBeFalsy();
    });
  });
});
