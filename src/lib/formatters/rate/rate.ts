import { Pipe, PipeTransform } from '@angular/core';
import { DtFormattedValue } from '../formatted-value';
import { formatRate } from './rate-formatter';
import { DtRateUnit } from '../unit';

/** Pipe used to add a rate (e.g. per second) to the value */
@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {
  /**
   * @param input - The number or DtFomrattedValue to be formatted with a rate
   * @param rateUnit - The unit for the rate of the input
   */
  transform(input: DtFormattedValue | number, rateUnit: DtRateUnit | string): DtFormattedValue {
    return formatRate(input, rateUnit);
  }

}
