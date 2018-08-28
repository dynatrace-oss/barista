import { adjustNumber } from '../number-formatter';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtFormattedValue } from './../formatted-value';
import { DtUnit } from './../unit';
import { SourceData } from '../formatted-value';

export function formatPercent(input: number): DtFormattedValue {

  const inputData: SourceData = {
    value: input,
    unit: DtUnit.PERCENT,
    useAbbreviation: false,
  };

  const value = (coerceNumberProperty(input, NaN));

  const formattedData = (!isNaN(value))
    ? {
      transformedValue: value,
      displayValue: adjustNumber(value),
      displayUnit: DtUnit.PERCENT,
    }
    : {};

  return new DtFormattedValue(inputData, formattedData);
}
