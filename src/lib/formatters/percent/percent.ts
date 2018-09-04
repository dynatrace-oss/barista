import { Pipe, PipeTransform } from '@angular/core';
import { DtFormattedValue } from '../formatted-value';
import { formatPercent } from './percent-formatter';

/** Pipe used to add percent formatting */
@Pipe({
  name: 'dtPercent',
})
export class DtPercent implements PipeTransform {
  /**
   * @param input - The number to be formatted as a percentage
   */
  transform(input: number): DtFormattedValue {
    return formatPercent(input);
  }
}
