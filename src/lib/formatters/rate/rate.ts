import { Pipe, PipeTransform } from '@angular/core';
import { DtRateFormatter } from './rate-formatter';
import { DtFormattedValue } from '../formatted-value';

@Pipe({
  name: 'dtRate',
})
export class DtRate implements PipeTransform {

  constructor(private readonly _rateFormatter: DtRateFormatter) {}

  transform(value: DtFormattedValue | number, rateUnit: string): DtFormattedValue {
    return this._rateFormatter.formatRate(value, rateUnit);
  }

}
