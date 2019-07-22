import { DtUnit } from '../unit';
import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { Pipe, PipeTransform } from '@angular/core';
import { KILO_MULTIPLIER } from '../number-formatter';
import { formatBytes } from './bytes-formatter';
import { isNumber, isEmpty } from '@dynatrace/angular-components/core';

/**
 * Pipe for formatting a given number to Kilobytes
 */
@Pipe({
  name: 'dtKilobytes',
})
export class DtKilobytes implements PipeTransform {
  /**
   * @param input - The value to be formatted as Kilobytes
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
        outputUnit: DtUnit.KILO_BYTES,
      });
    }
    if (isNumber(input)) {
      return formatBytes(input, {
        factor,
        inputUnit,
        outputUnit: DtUnit.KILO_BYTES,
      });
    }

    return NO_DATA;
  }
}
