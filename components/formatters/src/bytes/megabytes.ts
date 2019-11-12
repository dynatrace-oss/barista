import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumber } from '@dynatrace/angular-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { KILO_MULTIPLIER } from '../number-formatter';
import { DtUnit } from '../unit';
import { formatBytes } from './bytes-formatter';

/**
 * Pipe for formatting a given number to Megabytes
 */
@Pipe({
  name: 'dtMegabytes',
})
export class DtMegabytes implements PipeTransform {
  /**
   * @param input - The number to be formatted as Megabytes
   * @param factor - The factor used to divide the number for decimal prefixes. Default is 1000
   * @param inputUnit - The unit for the input number. Default is DtUnit.BYTES
   */
  transform(
    // tslint:disable-next-line:no-any
    input: any,
    factor: number = KILO_MULTIPLIER,
    inputUnit: DtUnit = DtUnit.BYTES,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatBytes(input, {
        factor,
        inputUnit,
        outputUnit: DtUnit.MEGA_BYTES,
      });
    }
    if (isNumber(input)) {
      return formatBytes(coerceNumberProperty(input), {
        factor,
        inputUnit,
        outputUnit: DtUnit.MEGA_BYTES,
      });
    }

    return NO_DATA;
  }
}
