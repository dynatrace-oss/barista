import { DtFormattedValue } from '../formatted-value';
import { Pipe, PipeTransform } from '@angular/core';
import { DtNumberFormatOptions, KILO_MULTIPLIER } from '../number-formatter';
import { formatBytes } from './bytes-formatter';
import { DtUnit, DtRateUnit } from '../unit';

/**
 * Pipe for formatting a given number to Bytes
 */
@Pipe({
  name: 'dtBytes',
})
export class DtBytes implements PipeTransform {
  /**
   * @param input - The number to be formatted as bytes
   * @param factor - The factor used to divide the number for decimal prefixes. Default is 1000
   * @param inputUnit - The unit for the input number. Default is DtUnit.BYTES
   */
  transform(
    input: number,
    factor: number = KILO_MULTIPLIER,
    inputUnit: DtUnit = DtUnit.BYTES
  ): DtFormattedValue {
    return formatBytes(input, { factor, inputUnit });
  }
}
