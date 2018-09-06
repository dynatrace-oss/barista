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
  const displayValue = input instanceof DtFormattedValue ? input.displayData.displayValue : input.toString();
  const displayUnit = input instanceof DtFormattedValue ? input.displayData.displayUnit : undefined;

  const formattedData: FormattedData = {
    transformedValue: sourceData.input,
    displayRateUnit: rateUnit,
    displayUnit,
    displayValue,
  };

  return new DtFormattedValue(sourceData, formattedData);
}
