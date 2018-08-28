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

function addRateToNumber(input: number, rateUnit: string): DtFormattedValue {

  const formattedValue = formatCount(input);

  const formattedData = {
    transformedValue: formattedValue.displayData.transformedValue,
    displayValue: formattedValue.displayData.displayValue,
    displayUnit: formattedValue.displayData.displayUnit,
    displayRateUnit: rateUnit,
  };

  return new DtFormattedValue(formattedValue.sourceData, formattedData);
}

function addRateToFormattedValue(input: DtFormattedValue, rateUnit: string): DtFormattedValue {
  if (notAcceptedUnits.has(input.sourceData.unit)) {
    return input;
  }

  const sourceRateUnit = input.sourceData.rateUnit;
  if (sourceRateUnit !== undefined && sourceRateUnit !== rateUnit) {
    return recalculateValue(input, rateUnit);
  }

  const formattedData = {
    transformedValue: input.displayData.transformedValue,
    displayValue: input.displayData.displayValue,
    displayUnit: input.displayData.displayUnit,
    displayRateUnit: rateUnit,
  };

  return new DtFormattedValue(input.sourceData, formattedData);
}

function recalculateValue(input: DtFormattedValue, rateUnit: DtRateUnit | string): DtFormattedValue {
  if (rateUnit === DtRateUnit.PER_SECOND) {
    return toRateUnit(input, rateUnit, DtRateUnit.PER_MINUTE, TIME_CONVERSION_FACTOR);
  } else if (rateUnit === DtRateUnit.PER_MINUTE) {
    return toRateUnit(input, rateUnit, DtRateUnit.PER_SECOND, 1 / TIME_CONVERSION_FACTOR);
  }

  return input;
}

function toRateUnit(input: DtFormattedValue, rateUnit: DtRateUnit | string,
                    fromUnit: DtRateUnit | string, ratio: number): DtFormattedValue {

  const value = coerceNumberProperty(input.displayData.transformedValue, NaN);

  const formattedData = (input.sourceData.rateUnit === fromUnit && !isNaN(value))
    ? {
      transformedValue: value * ratio,
      displayValue: adjustNumber(value * ratio, input.sourceData.useAbbreviation),
      displayUnit: input.displayData.displayUnit,
      displayRateUnit: rateUnit,
    }
    : {
      transformedValue: input.displayData.transformedValue,
      displayValue: input.displayData.displayValue,
      displayUnit: input.displayData.displayUnit,
      displayRateUnit: rateUnit,
    };

  return new DtFormattedValue(input.sourceData, formattedData);
}
