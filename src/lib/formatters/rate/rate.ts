import { Pipe, PipeTransform } from '@angular/core';
import { DtRateFormatter } from './rate-formatter';
import { DtFormattedValue } from '../formatted-value';

@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {

  constructor(private readonly rateFormatter: DtRateFormatter) {}

  transform(value: DtFormattedValue | number, rateUnit: string): DtFormattedValue {
    return this.rateFormatter.formatRate(value, rateUnit);
  }

}
