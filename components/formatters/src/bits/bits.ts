import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumber } from '@dynatrace/angular-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { KILO_MULTIPLIER } from '../number-formatter';
import { DtUnit } from '../unit';
import { formatBits } from './bits-formatter';

/** Pipe for formatting a given number to Bits */
@Pipe({
  name: 'dtBits',
})
export class DtBits implements PipeTransform {
  /**
   * @param input - The value to be formatted as bits
   * @param factor - The factor used to divide the number for decimal prefixes. Default is 1000
   * @param inputUnit - The unit for the input number. Default is DtUnit.BITS
   */
  transform(
    // tslint:disable-next-line:no-any
    input: any,
    factor: number = KILO_MULTIPLIER,
    inputUnit: DtUnit = DtUnit.BITS,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatBits(input, { factor, inputUnit });
    }
    if (isNumber(input)) {
      return formatBits(coerceNumberProperty(input), { factor, inputUnit });
    }

    return NO_DATA;
  }
}
