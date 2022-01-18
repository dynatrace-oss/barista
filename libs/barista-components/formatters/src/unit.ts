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

/* eslint-disable no-shadow */

/**
 * Enumeration for the different basic units
 */
export const enum DtUnit {
  PERCENT = '%',
  COUNT = 'count',
  BYTES = 'B',
  KILO_BYTES = 'kB',
  MEGA_BYTES = 'MB',
  GIGA_BYTES = 'GB',
  TERA_BYTES = 'TB',
  PETA_BYTES = 'PB',
  KIBI_BYTES = 'kiB',
  MEBI_BYTES = 'MiB',
  GIBI_BYTES = 'GiB',
  TEBI_BYTES = 'TiB',
  PEBI_BYTES = 'PiB',
  BITS = 'bit',
  KILO_BITS = 'kbit',
  MEGA_BITS = 'Mbit',
  GIGA_BITS = 'Gbit',
  TERA_BITS = 'Tbit',
  PETA_BITS = 'Pbit',
}

/**
 * Enumeration with diffent rates added to the value
 * e.g. per second, per minute
 */
export enum DtRateUnit {
  PER_NANOSECOND = 'ns',
  PER_MILLISECOND = 'ms',
  PER_SECOND = 's',
  PER_MINUTE = 'min',
  PER_HOUR = 'h',
  PER_DAY = 'd',
  PER_WEEK = 'w',
  PER_MONTH = 'mo',
  PER_YEAR = 'y',
}

export enum DtTimeUnit {
  YEAR = 'y',
  MONTH = 'mo',
  DAY = 'd',
  HOUR = 'h',
  MINUTE = 'min',
  SECOND = 's',
  MILLISECOND = 'ms',
  MICROSECOND = 'µs',
  NANOSECOND = 'ns',
}
