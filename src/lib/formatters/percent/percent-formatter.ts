import { adjustNumber } from '../number-formatter';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtFormattedValue } from './../formatted-value';
import { DtUnit } from './../unit';
import { SourceData } from '../formatted-value';

/**
 * Util function that adds percent formatting to any number
 *
 * @param input - numeric value to be transformed
 */
export function formatPercent(input: number): DtFormattedValue {
  const inputData: SourceData = {
    input,
    unit: DtUnit.PERCENT,
  };

  const value = coerceNumberProperty(input, NaN);

  const formattedData = !isNaN(value)
    ? {
        transformedValue: value,
        displayValue: adjustNumber(value),
        displayUnit: inputData.unit,
      }
    : {};

  return new DtFormattedValue(inputData, formattedData);
}
