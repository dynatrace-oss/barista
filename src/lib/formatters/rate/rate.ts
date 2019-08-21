import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumber } from '@dynatrace/angular-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { DtRateUnit } from '../unit';
import { formatRate } from './rate-formatter';

/** Pipe used to add a rate (e.g. per second) to the value */
@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {
  /**
   * @param input - The value or DtFomrattedValue to be formatted with a rate
   * @param rateUnit - The unit for the rate of the input
   */
  transform(
    input: any, // tslint:disable-line:no-any
    rateUnit: DtRateUnit | string,
  ): DtFormattedValue | string {
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
