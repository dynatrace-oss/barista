import { Pipe, PipeTransform } from '@angular/core';
import { DtUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { formatCount } from './count-formatter';

@Pipe({
  name: 'dtCount',
})
export class DtCount implements PipeTransform {

  transform(input: number, inputUnit: DtUnit | string = DtUnit.COUNT, inputRateUnit?: string): DtFormattedValue {
    return formatCount(input, inputUnit, inputRateUnit);
  }
}
