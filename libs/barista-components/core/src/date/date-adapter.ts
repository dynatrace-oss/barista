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

import { inject, InjectionToken, LOCALE_ID } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/** InjectionToken for datepicker that can be used to override default locale code. */
export const DT_DATE_LOCALE = new InjectionToken<string>('DT_DATE_LOCALE', {
  providedIn: 'root',
  factory: DT_DATE_LOCALE_FACTORY,
});

/** @docs-private */
export function DT_DATE_LOCALE_FACTORY(): string {
  return inject(LOCALE_ID);
}

export abstract class DtDateAdapter<D> {
  /** The locale to use for all dates. */
  protected locale: any;

  /** A stream that emits when the locale changes. */
  get localeChanges(): Observable<void> {
    return this._localeChanges.asObservable();
  }
  protected _localeChanges = new Subject<void>();

  /** Sets the locale used for all dates. */
  setLocale(locale: any): void {
    this.locale = locale;
    this._localeChanges.next();
  }

  /**
   * Creates a date with the given year, month, and date.
   * Does not allow over/under-flow of the month and date.
   */
  abstract createDate(year: number, month: number, date: number): D;

  /** Gets today's date. */
  abstract today(): D;

  /** Gets the year component of the given date. */
  abstract getYear(date: D): number;

  /** Gets the month component of the given date. */
  abstract getMonth(date: D): number;

  /** Gets the date of the month component of the given date. */
  abstract getDate(date: D): number;

  /** Gets the day of the week component of the given date. */
  abstract getDayOfWeek(date: D): number;

  /** Gets the first day of the week. */
  abstract getFirstDayOfWeek(): number;

  /** Gets a list of names for the days of the week. */
  abstract getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];

  /** Gets the number of days in the month of the given date. */
  abstract getNumDaysInMonth(date: D): number;

  /** Gets a list of names for the dates of the month. */
  abstract getDateNames(): string[];

  /** Checks whether the given object is considered a date instance by this DateAdapter. */
  abstract isDateInstance(obj: any): obj is D;

  /** Checks whether the given date is valid. */
  abstract isValid(date: D): boolean;

  /** Formats a date as a string according to the given format. */
  abstract format(date: D, displayFormat: Object): string;

  /**
   * Adds the given number of years to the date. Years are counted as if flipping 12 pages on the
   * calendar for each year and then finding the closest date in the new month. For example when
   * adding 1 year to Feb 29, 2016, the resulting date will be Feb 28, 2017.
   */
  abstract addCalendarYears(date: D, years: number): D;

  /**
   * Adds the given number of months to the date. Months are counted as if flipping a page on the
   * calendar for each month and then finding the closest date in the new month. For example when
   * adding 1 month to Jan 31, 2017, the resulting date will be Feb 28, 2017.
   */
  abstract addCalendarMonths(date: D, months: number): D;

  /** Adds the given number of days to the date. */
  abstract addCalendarDays(date: D, days: number): D;

  /**
   * Compares two dates.
   * Returns 0 if the dates are equal,
   * a number less than 0 if the first date is earlier,
   * a number greater than 0 if the first date is later
   */
  compareDate(first: D, second: D): number {
    return (
      this.getYear(first) - this.getYear(second) ||
      this.getMonth(first) - this.getMonth(second) ||
      this.getDate(first) - this.getDate(second)
    );
  }

  /** Clamp the given date between min and max dates. */
  clampDate(date: D, min?: D | null, max?: D | null): D {
    if (min && this.compareDate(date, min) < 0) {
      return min;
    }
    if (max && this.compareDate(date, max) > 0) {
      return max;
    }
    return date;
  }
}
