import { adjustNumber } from '../number-formatter';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtFormattedValue } from './../formatted-value';
import { DtUnit } from './../unit';

export function formatPercent(input: number): DtFormattedValue {

  const formattedValue = new DtFormattedValue(input, DtUnit.PERCENT);
  const value = (coerceNumberProperty(input, NaN));
  if (!isNaN(value)) {
    formattedValue.transformedValue = value;
    formattedValue.displayValue = adjustNumber(value);
    formattedValue.displayUnit = DtUnit.PERCENT;
  }

  return formattedValue;
}
