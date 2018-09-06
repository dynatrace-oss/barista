import { Pipe, PipeTransform } from '@angular/core';
import { DtUnit } from '../unit';
import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { formatCount } from './count-formatter';
import { isNumber, isEmpty } from '@dynatrace/angular-components/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Pipe({
  name: 'dtCount',
})
export class DtCount implements PipeTransform {
  /**
   * @param input - The value to be formatted as an abbreviation
   * @param inputUnit - The unit for the input number. Default is DtUnit.COUNT
   */
  transform(
    // tslint:disable-next-line:no-any
    input: any,
    inputUnit: DtUnit | string = DtUnit.COUNT
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatCount(input, inputUnit);
    }
    if (isNumber(input)) {
      return formatCount(coerceNumberProperty(input), inputUnit);
    }

    return NO_DATA;
  }
}
