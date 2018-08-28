import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtRateUnit, DtUnit } from '../unit';
import { DtFormattedValue, SourceData } from '../formatted-value';
import { adjustNumber } from '../number-formatter';

/**
 *
 *  Returns DtFormattedValue
 *    - toString() method returns basic string to be displayed;
 *    - displayData contains value, unit and rate unit to be displayed separately;
 *
 * @param input - numeric value to be transformed
 * @param inputUnit - input unit, typically defined unit of type DtUnit (DtUnit.COUNT by default), custom strings are also allowed
 * @param inputRateUnit - additional information about possible rate unit (optional);
 *    value is used only as a reference in case an additional rate pipe is used
 */
export function formatCount(input: number, inputUnit: DtUnit | string = DtUnit.COUNT,
                            inputRateUnit?: DtRateUnit | string): DtFormattedValue {

  const inputData: SourceData = {
    value: input,
    unit: inputUnit,
    rateUnit: inputRateUnit,
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
