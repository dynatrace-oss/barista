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

import {
  DtDateAdapter,
  isEmpty,
  isNumberLike,
  isString,
} from '@dynatrace/barista-components/core';

const MAX_HOURS = 23;
const MAX_MINUTES = 59;
const MIN_HOURS = 0;
const MIN_MINUTES = 0;
const INVALID_TIME_FORMAT_REGEX = /[0]{3,}|[.+-]|[0]{2}[0-9]/g;
const HOURMIN_REGEX = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/g;

/** Checks whether the provided object is a valid date and returns it; null otherwise. */
export function getValidDateOrNull<T>(
  dateAdapter: DtDateAdapter<T>,
  obj: any,
): T | null {
  return dateAdapter.isDateInstance(obj) && dateAdapter.isValid(obj)
    ? obj
    : null;
}

/**
 * Check if the given date is outside the min and max dates.
 * @param date
 * The date that need to be checked.
 * @param dateAdapter
 * The date adapter being used should be passed in here.
 * @param min?
 * The minimum date or null.
 * @param max?
 * The maximum date or null.
 * @param ignoreDay
 * If ignoreDay is set to true, check only using the month and year, while ignoring the day.
 * This is necessary for the calendar header buttons, which need to be enabled when switching to next/prev years regardless of the day.
 * @returns boolean
 */
export function isOutsideMinMaxRange<T>(
  date: T,
  dateAdapter: DtDateAdapter<T>,
  min?: T | null,
  max?: T | null,
  ignoreDay: boolean = false,
): boolean {
  const compareFct = ignoreDay
    ? (first: T, second: T) => dateAdapter.compareDateIgnoreDay(first, second)
    : (first: T, second: T) => dateAdapter.compareDate(first, second);

  if (min && compareFct(date, min) < 0) {
    return true;
  }

  if (max && compareFct(date, max) > 0) {
    return true;
  }

  return false;
}

/** Check if the hour value is valid. */
export function isValidHour(value: any): boolean {
  return isValid(value, MIN_HOURS, MAX_HOURS);
}

/** Check if the minute value is valid. */
export function isValidMinute(value: any): boolean {
  return isValid(value, MIN_MINUTES, MAX_MINUTES);
}

/**
 * Check if a value of a valid hour/minute number is in the range
 * Note that if a number is passed directly in with the format 'n.0', such as 5.0, it will be truncated to 5 and validation will fail.
 * However, this cannot happen with the input event, since it will be passed as a string. Also, typing '.' is prevented on keydown.
 */
export function isValid(value: any, min: number, max: number): boolean {
  if (isEmpty(value) || !isNumberLike(value)) {
    return false;
  }

  // the regex is necessary for invalidating chars like '-' or '.', as well as multiple leading 0s.
  const stringifiedVal = isString(value) ? value : value.toString();
  if (stringifiedVal.match(INVALID_TIME_FORMAT_REGEX)) {
    return false;
  }

  const parsedValue = parseInt(value, 10);
  return parsedValue >= min && parsedValue <= max;
}

/** Check if a number has at least two digits or is null. */
export function hasMininmumTwoDigits(input: number | null): boolean {
  return input !== null && input >= 10;
}

/**
 * Format a number with max two digits to always display two digits
 * (with a leading 0 in case it is a single digit or convert it to string otherwise).
 */
export function valueTo2DigitString(value: number): string {
  return value < 10 ? `0${value}` : value.toString();
}

/** Check if a pasted value is a valid hour and minute value. */
export function isPastedTimeValid(value: string): boolean {
  return Boolean(value.match(HOURMIN_REGEX));
}
