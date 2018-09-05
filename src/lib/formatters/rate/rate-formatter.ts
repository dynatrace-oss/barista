import { DtUnit, DtRateUnit } from '../unit';
import { DtFormattedValue, FormattedData } from '../formatted-value';
import { formatCount } from '../count/count-formatter';

/**
 * Util function that adds rate formatting
 *
 * @param input - numeric value or DtFormattedValue to be transformed
 * @param rateUnit - rate unit connected and displayed with the value,
 *  typically defined rate unit of type DtRateUnit, custom strings are also allowed
 * @param inputRate - rate for the input - used to convert to rateUnit
 *  e.g. if input value is per second but you want to display per millisecond
 */
export function formatRate(
  input: DtFormattedValue | number,
  rateUnit: DtRateUnit | string,
  inputRate?: DtRateUnit
): DtFormattedValue {

  const sourceData = input instanceof DtFormattedValue ?
  input.sourceData :
  { input, unit: DtUnit.COUNT };
  let transformedValue = sourceData.input;

  if (inputRate && isDtRateUnit(rateUnit) && transformedValue !== undefined) {
    transformedValue = convertRates(transformedValue, inputRate, rateUnit as DtRateUnit);
  }
  const formattedData: FormattedData = {
    transformedValue,
    displayRateUnit: !isNaN(transformedValue) ? rateUnit : undefined,
    displayUnit: sourceData.unit !== DtUnit.COUNT && !isNaN(transformedValue) ? sourceData.unit : undefined,
    displayValue: transformedValue !== undefined ? transformedValue.toString() : undefined,
  };

  return new DtFormattedValue(sourceData, formattedData);
}

export function getFactorToMs(rate: DtRateUnit): number {
  let factor = 1;

  if (rate === DtRateUnit.PER_MILLISECOND) {
    return factor;
  }
  factor = factor * 1000;
  if (rate === DtRateUnit.PER_SECOND) {
    return factor;
  }
  factor = factor * 60;
  if (rate === DtRateUnit.PER_MINUTE) {
    return factor;
  }
  factor = factor * 60;
  if (rate === DtRateUnit.PER_HOUR) {
    return factor;
  }
  factor = factor * 24;
  if (rate === DtRateUnit.PER_DAY) {
    return factor;
  }
  factor = factor * 7;
  if (rate === DtRateUnit.PER_WEEK) {
    return factor;
  }
  factor = factor * 30;
  if (rate === DtRateUnit.PER_MONTH) {
    return factor;
  }
  return factor * 12;
}

export function convertRates(input: number, fromRate: DtRateUnit, toRate: DtRateUnit): number {
  const fromInMs = input / getFactorToMs(fromRate);
  return fromInMs * getFactorToMs(toRate);
}

function isDtRateUnit(unit: DtRateUnit | string): boolean {
  return Object.values(DtRateUnit).includes(unit);
}
