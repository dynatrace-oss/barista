import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtUnit, DtRateUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { formatCount } from '../count/count-formatter';
import { adjustNumber } from '../number-formatter';

const TIME_CONVERSION_FACTOR = 60;
const notAcceptedUnits = new Set()
  .add(DtUnit.PERCENT);

export function formatRate(source: DtFormattedValue | number, rateUnit: string): DtFormattedValue {

  return (source instanceof DtFormattedValue)
    ? addRateToFormattedValue(source, rateUnit)
    : addRateToNumber(source, rateUnit);
}

function addRateToNumber(value: number, rateUnit: string): DtFormattedValue {

  const formatted = formatCount(value);
  formatted.displayRateUnit = rateUnit;

  return formatted;
}

function addRateToFormattedValue(formattedValue: DtFormattedValue, rateUnit: string): DtFormattedValue {
  let formatted = formattedValue;

  if (!notAcceptedUnits.has(formatted.sourceUnit)) {
    const sourceRateUnit = formatted.sourceRateUnit;
    if (sourceRateUnit !== undefined && sourceRateUnit !== rateUnit) {
      formatted = recalculateValue(formatted, rateUnit);
    }

    formatted.displayRateUnit = rateUnit;
  }

  return formattedValue;
}

function recalculateValue(formatted: DtFormattedValue, rateUnit: string): DtFormattedValue {
  if (rateUnit === DtRateUnit.PER_SECOND) {
    return toPerSecond(formatted);
  } else if (rateUnit === DtRateUnit.PER_MINUTE) {
    return toPerMinute(formatted);
  }

  return formatted;
}

function toPerSecond(formatted: DtFormattedValue): DtFormattedValue {
  const value = coerceNumberProperty(formatted.transformedValue, NaN);

  if (formatted.sourceRateUnit === DtRateUnit.PER_MINUTE && !isNaN(value)) {
    formatted.transformedValue = coerceNumberProperty(value) / TIME_CONVERSION_FACTOR;
    formatted.displayValue = adjustNumber(formatted.transformedValue, formatted.useAbbreviation);
  }

  return formatted;
}

function toPerMinute(formatted: DtFormattedValue): DtFormattedValue {
  const value = coerceNumberProperty(formatted.transformedValue, NaN);
  if (formatted.sourceRateUnit === DtRateUnit.PER_SECOND && !isNaN(value)) {
    formatted.transformedValue = coerceNumberProperty(value) * TIME_CONVERSION_FACTOR;
    formatted.displayValue = adjustNumber(formatted.transformedValue, formatted.useAbbreviation);
  }

  return formatted;
}
