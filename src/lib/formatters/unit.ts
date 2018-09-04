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
  PER_MILLISECOND = 'ms',
  PER_SECOND = 's',
  PER_MINUTE = 'min',
  PER_HOUR = 'h',
  PER_DAY = 'd',
  PER_WEEK = 'w',
  PER_MONTH = 'mo',
  PER_YEAR = 'y',
}
