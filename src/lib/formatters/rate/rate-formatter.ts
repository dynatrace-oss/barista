import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtUnit, DtRateUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { formatCount } from '../count/count-formatter';
import { adjustNumber } from '../number-formatter';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components/core';

const LOG: DtLogger = DtLoggerFactory.create('rate-formatter');
const TIME_CONVERSION_FACTOR = 60;
const notAcceptedUnits = new Set()
  .add(DtUnit.PERCENT);

/**
 *
 *  Returns DtFormattedValue
 *    - toString() method returns basic string to be displayed;
 *    - displayData contains value, unit and rate unit to be displayed separately;
 *
 * @param input - numeric value to be transformed
 * @param rateUnit - rate unit connected and displayed with the value,
 *    typically defined rate unit of type DtRateUnit, custom strings are also allowed
 */
export function formatRate(input: DtFormattedValue | number, rateUnit: DtRateUnit | string): DtFormattedValue {

  return (input instanceof DtFormattedValue)
    ? addRateToFormattedValue(input, rateUnit)
    : addRateToNumber(input, rateUnit);
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
    LOG.error(`Formatting not possible for combination of units: ${input.sourceData.unit}/${rateUnit}`, input);
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
