import { SourceData, FormattedData, DtFormattedValue } from './formatted-value';
import { DtUnit } from './unit';
import { DtNumberFormatOptions, adjustNumber } from './number-formatter';
import { coerceNumberProperty } from '@angular/cdk/coercion';

export interface DtUnitConversion {
  multiplier: number;
  unit: DtUnit;
}

/** Util function used to format a number to either Bits or Bytes */
export function formatToBitsBytes(
  input: number,
  conversions: DtUnitConversion[],
  options: DtNumberFormatOptions
): DtFormattedValue {
  const inputData: SourceData = {
    input,
    unit: options.inputUnit,
    useAbbreviation: false,
  };

  let formattedData: FormattedData = {};
  const value = coerceNumberProperty(inputData.input, NaN);
  if (!isNaN(value)) {
    const valueInUnit = convertToUnit(value, conversions, inputData.unit);
    const conversion = options.outputUnit
      ? getFixedUnitConversion(conversions, options.outputUnit)
      : getAutoUnitConversion(conversions, valueInUnit);
    const convertedValue = conversion ? valueInUnit / conversion.multiplier : valueInUnit;
    const convertedUnit = conversion ? conversion.unit : options.inputUnit;

    formattedData = {
      transformedValue: convertedValue,
      displayValue: adjustNumber(convertedValue),
      displayUnit: convertedUnit,
    };
  }

  return new DtFormattedValue(inputData, formattedData);
}

/** Converts number to given unit by applying the corect conversionrate */
function convertToUnit(input: number, conversions: DtUnitConversion[], inputUnit: string): number {
  const conversion = conversions.find((m) => m.unit === inputUnit);
  return conversion !== undefined
    ? input * conversion.multiplier
    : input;
}

function getAutoUnitConversion(conversions: DtUnitConversion[], valueInUnit: number): DtUnitConversion | undefined {
  return conversions.find((m) => valueInUnit >= m.multiplier);
}

function getFixedUnitConversion(conversions: DtUnitConversion[], outputUnit: string): DtUnitConversion | undefined {
  return conversions.find((m) => m.unit === outputUnit);
}
