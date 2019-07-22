import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { Pipe, PipeTransform } from '@angular/core';
import { KILO_MULTIPLIER } from '../number-formatter';
import { formatBytes } from './bytes-formatter';
import { DtUnit } from '../unit';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { isNumber, isEmpty } from '@dynatrace/angular-components/core';

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
    // tslint:disable-next-line:no-any
    input: any,
    factor: number = KILO_MULTIPLIER,
    inputUnit: DtUnit = DtUnit.BYTES,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatBytes(input, { factor, inputUnit });
    }
    if (isNumber(input)) {
      return formatBytes(coerceNumberProperty(input), { factor, inputUnit });
    }

    return NO_DATA;
  }
}
