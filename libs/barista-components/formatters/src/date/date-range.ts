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

import { formatDate } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DtLogger, DtLoggerFactory } from '@dynatrace/barista-components/core';

/**
 * Error message that should be logged if no numbers are provided to the dateRange formatter.
 *
 * @internal
 */
export const ERROR_MESSAGE_NO_NUMBERS_PROVIDED =
  'The DtDateRange formatter could not format the provided values! Please ensure that two numbers are provided!';

/**
 * Error message that should be logged if not 2 numbers are provided.
 *
 * @internal
 */
export const ERROR_MESSAGE_WRONG_FORMAT =
  'The DtDateRange formatter expects an array of two numbers that should be formatted!';

/** @internal Placeholder that should be displayed if no valid timestamps are provided */
export const PLACEHOLDER = '{from} – {to}';

/** Instance of the logger for the date range formatter */
const logger: DtLogger = DtLoggerFactory.create('DtDateRange Formatter');

@Pipe({
  name: 'dtDateRange',
  pure: true,
})
export class DtDateRange implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  /**
   * Pipe will format 2 UTC Timestamps to date time.
   * Client web browser time zone will be included.
   *
   * ### Formatting Examples
   * - `Jan 24 09:05 - 15:59` - for same day
   * - `Jan 23 00:00 - Jan 24 12:01` - for different dates in current year
   * - `2017 Apr 13 13:13 - 2018 Jun 06 06:06` - for different dates and years
   *
   * ### Usage in templates
   *
   * `{{ [startUtcTimestamp, endUtcTimestamp] | dtDateRange }}`
   */
  transform(value: [number, number]): string {
    // eslint-disable-next-line  no-magic-numbers
    if (!Array.isArray(value) || value.length !== 2) {
      logger.error(ERROR_MESSAGE_WRONG_FORMAT);
      return PLACEHOLDER;
    }

    return dtFormatDateRange(value[0], value[1], this._locale);
  }
}

/**
 * Formats two provided dates (start and end) to reflect a range.
 *
 * @param start The start timestamp.
 * @param end The end timestamp.
 * @param locale The locale to format with – default: *en-US*
 * @example
 * `Jan 24 09:05 - 15:59` - For the same day.
 * `Jan 23 00:00 - Jan 24 12:01` - For different dates in the current year.
 * `2017 Apr 13 13:13 - 2018 Jun 06 06:06` - For different dates and years.
 */
export function dtFormatDateRange(
  start: number,
  end: number,
  locale: string = 'en-US',
): string {
  if (isNaN(start) || isNaN(end)) {
    logger.error(ERROR_MESSAGE_NO_NUMBERS_PROVIDED);
    return PLACEHOLDER;
  }

  const date1 = new Date(start);
  const date2 = new Date(end);
  const now = new Date(Date.now());

  let dateString1 = 'MMM d HH:mm';
  let dateString2 = 'MMM d HH:mm';

  if (date1.getUTCFullYear() === date2.getUTCFullYear()) {
    if (now.getUTCFullYear() !== date1.getUTCFullYear()) {
      dateString1 = 'y MMM d HH:mm';
    }

    if (
      date1.getUTCMonth() === date2.getUTCMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      dateString2 = 'HH:mm';
    }
  } else {
    dateString1 = 'y MMM d HH:mm';
    dateString2 = dateString1;
  }

  dateString1 = formatDate(start, dateString1, locale);
  dateString2 = formatDate(end, dateString2, locale);

  return `${dateString1} — ${dateString2}`;
}
