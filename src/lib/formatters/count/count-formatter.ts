import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { adjustNumber } from '../number-formatter';

export function formatCount(input: number, inputUnit: DtUnit | string = DtUnit.COUNT, inputRateUnit?: string): DtFormattedValue {

  const formattedValue = new DtFormattedValue(input, inputUnit, inputRateUnit);
  const value = (coerceNumberProperty(input, NaN));
  if (!isNaN(value)) {
    formattedValue.useAbbreviation = true;
    formattedValue.transformedValue = value;
    formattedValue.displayValue = adjustNumber(value, true);

    formattedValue.displayUnit = inputUnit !== DtUnit.COUNT
      ? inputUnit
      : undefined;
  }

  return formattedValue;
}
