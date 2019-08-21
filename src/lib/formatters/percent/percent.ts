import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumber } from '@dynatrace/angular-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { formatPercent } from './percent-formatter';

/** Pipe used to add percent formatting */
@Pipe({
  name: 'dtPercent',
})
export class DtPercent implements PipeTransform {
  /**
   * @param input - The value to be formatted as a percentage
   */
  // tslint:disable-next-line:no-any
  transform(input: any): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    if (isNumber(input)) {
      return formatPercent(input);
    }

    return NO_DATA;
  }
}
