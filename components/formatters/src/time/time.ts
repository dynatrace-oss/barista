import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty, isNumber } from '@dynatrace/angular-components/core';

import { DtFormattedValue, NO_DATA } from '../formatted-value';
import { DtTimeUnit } from '../unit';
import { formatTime } from './time-formatter';

/** Pipe used to convert milliseconds to amount of time from years to nanoseconds */
@Pipe({
  name: 'dtTime',
})
export class DtTime implements PipeTransform {
  /**
   * @param input - The timevalue to be formatted to amount of time from years to nanoseconds
   */
  // tslint:disable: no-any
  transform(
    input: any,
    inputUnit: DtTimeUnit = DtTimeUnit.MILLISECOND,
    toUnit: DtTimeUnit | undefined,
  ): DtFormattedValue | string {
    if (isEmpty(input)) {
      return NO_DATA;
    }
    return isNumber(input)
      ? formatTime(coerceNumberProperty(input), inputUnit, toUnit)
      : NO_DATA;
  }
}
