import { Pipe, PipeTransform } from '@angular/core';
import { DtFormattedValue } from '../formatted-value';
import { formatRate } from './rate-formatter';

@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {

  transform(value: DtFormattedValue | number, rateUnit: string): DtFormattedValue {
    return formatRate(value, rateUnit);
  }

}
