import { adjustPrecision } from './../formatter-util';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtFormattedValue } from './../formatted-value';
import { DtUnit } from './../unit';

export function formatPercent(input: number): DtFormattedValue {

  const formattedValue = new DtFormattedValue(input, DtUnit.PERCENT);
  const value = (coerceNumberProperty(input, NaN));
  if (!isNaN(value)) {
    formattedValue.transformedValue = value;
    formattedValue.displayValue = adjustPrecision(value);
    formattedValue.displayUnit = DtUnit.PERCENT;
  }

  return formattedValue;
}
