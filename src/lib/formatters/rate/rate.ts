import { Pipe, PipeTransform } from '@angular/core';
import { DtFormattedValue } from '../formatted-value';
import { formatRate } from './rate-formatter';
import { DtRateUnit } from '../unit';

@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {

  transform(value: DtFormattedValue | number, rateUnit: DtRateUnit | string): DtFormattedValue {
    return formatRate(value, rateUnit);
  }

}
