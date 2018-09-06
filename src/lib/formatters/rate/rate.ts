import { Pipe, PipeTransform } from '@angular/core';
import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { formatRate } from './rate-formatter';
import { DtRateUnit } from '../unit';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { isEmpty, isNumber } from '@dynatrace/angular-components/core';

/** Pipe used to add a rate (e.g. per second) to the value */
@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {
  /**
   * @param input - The value or DtFomrattedValue to be formatted with a rate
   * @param rateUnit - The unit for the rate of the input
   */
  // tslint:disable-next-line:no-any
  transform(input: any, rateUnit: DtRateUnit | string): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (input instanceof DtFormattedValue) {
      return formatRate(input, rateUnit);
    }
    if (isNumber(input)) {
      return formatRate(coerceNumberProperty(input), rateUnit);
    }

    return NO_DATA;
  }

}
