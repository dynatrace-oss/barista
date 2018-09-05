import { DtUnit, DtRateUnit } from '../unit';
import { DtFormattedValue, FormattedData } from '../formatted-value';

/**
 * Util function that adds rate formatting
 *
 * @param input - numeric value or DtFormattedValue to be transformed
 * @param rateUnit - rate unit connected and displayed with the value,
 *  typically defined rate unit of type DtRateUnit, custom strings are also allowed
 */
export function formatRate(
  input: DtFormattedValue | number,
  rateUnit: DtRateUnit | string
): DtFormattedValue {

  const sourceData = input instanceof DtFormattedValue ? input.sourceData : { input, unit: DtUnit.COUNT };
  let displayValue;
  if (input instanceof DtFormattedValue) {
    displayValue = input.displayData.displayValue;
  } else if (input !== undefined) {
    displayValue = input;
  }
  let displayUnit;
  if (input instanceof DtFormattedValue) {
    displayUnit = input.displayData.displayUnit;
  }

  const formattedData: FormattedData = {
    transformedValue: sourceData.input,
    displayRateUnit: sourceData.input !== undefined && !isNaN(sourceData.input) ? rateUnit : undefined,
    displayUnit,
    displayValue,
  };

  return new DtFormattedValue(sourceData, formattedData);
}
