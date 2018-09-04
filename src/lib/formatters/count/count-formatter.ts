import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtRateUnit, DtUnit } from '../unit';
import { DtFormattedValue, SourceData } from '../formatted-value';
import { adjustNumber } from '../number-formatter';

/**
 * Util function formats the given number to a set of counting abbreviations (e.g. '20000000' will result in '20 mil')
 *
 * @param input - numeric value to be transformed
 * @param inputUnit - input unit, typically defined unit of type DtUnit (DtUnit.COUNT by default), custom strings are also allowed
 *    value is used only as a reference in case an additional rate pipe is used
 */
export function formatCount(input: number, inputUnit: DtUnit | string = DtUnit.COUNT): DtFormattedValue {

  const inputData: SourceData = {
    input,
    unit: inputUnit,
    useAbbreviation: true,
  };

  const value = coerceNumberProperty(input, NaN);
  const formattedData = !isNaN(value)
    ? {
        transformedValue: value,
        displayValue: adjustNumber(value, true),
        displayUnit: inputUnit !== DtUnit.COUNT ? inputUnit : undefined,
      }
      : {};

  return new DtFormattedValue(inputData, formattedData);
}
