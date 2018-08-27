import { Pipe, PipeTransform } from '@angular/core';
import { DtFormattedValue } from '../formatted-value';
import { formatPercent } from './percent-util';

@Pipe({
  name: 'dtPercent',
})
export class DtPercent implements PipeTransform {

  transform(input: number): DtFormattedValue {
    return formatPercent(input);
  }
}
