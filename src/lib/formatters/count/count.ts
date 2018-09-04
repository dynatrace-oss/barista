import { Pipe, PipeTransform } from '@angular/core';
import { DtRateUnit, DtUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { formatCount } from './count-formatter';

@Pipe({
  name: 'dtCount',
})
export class DtCount implements PipeTransform {
  /**
   * @param input - The number to be formatted as an abbreviation
   * @param inputUnit - The unit for the input number. Default is DtUnit.COUNT
   */
  transform(input: number, inputUnit: DtUnit | string = DtUnit.COUNT): DtFormattedValue {
    return formatCount(input, inputUnit);
  }
}
