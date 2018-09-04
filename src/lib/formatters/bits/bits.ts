import { DtFormattedValue } from '../formatted-value';
import { Pipe, PipeTransform } from '@angular/core';
import { formatBits } from './bits-formatter';
import { KILO_MULTIPLIER } from '../number-formatter';
import { DtUnit } from '../unit';

/** Pipe for formatting a given number to Bits */
@Pipe({
  name: 'dtBits',
})
export class DtBits implements PipeTransform {
  /**
   * @param input - The number to be formatted as bits
   * @param factor - The factor used to divide the number for decimal prefixes. Default is 1000
   * @param inputUnit - The unit for the input number. Default is DtUnit.BITS
   */
  transform(
    input: number,
    factor: number = KILO_MULTIPLIER,
    inputUnit: DtUnit = DtUnit.BITS
  ): DtFormattedValue {
    return formatBits(input, { factor, inputUnit });
  }
}
