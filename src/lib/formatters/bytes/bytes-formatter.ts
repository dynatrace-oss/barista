import { DtRateUnit, DtUnit } from '../unit';
import { DtFormattedValue, FormattedData, SourceData } from '../formatted-value';
import { adjustNumber, KIBI_MULTIPLIER, KILO_MULTIPLIER } from '../number-formatter';
import { coerceNumberProperty } from '@angular/cdk/coercion';

interface Conversion {
  multiplier: number;
  unit: DtUnit;
}
// tslint:disable:no-magic-numbers
const KILO_CONVERSIONS = [
  { multiplier: Math.pow(KILO_MULTIPLIER, 5), unit: DtUnit.PETA_BYTES},
  { multiplier: Math.pow(KILO_MULTIPLIER, 4), unit: DtUnit.TERA_BYTES},
  { multiplier: Math.pow(KILO_MULTIPLIER, 3), unit: DtUnit.GIGA_BYTES},
  { multiplier: Math.pow(KILO_MULTIPLIER, 2), unit: DtUnit.MEGA_BYTES},
  { multiplier: KILO_MULTIPLIER, unit: DtUnit.KILO_BYTES},
];

const KIBI_CONVERSIONS = [
  { multiplier: Math.pow(KIBI_MULTIPLIER, 5), unit: DtUnit.PETA_BYTES},
  { multiplier: Math.pow(KIBI_MULTIPLIER, 4), unit: DtUnit.TERA_BYTES},
  { multiplier: Math.pow(KIBI_MULTIPLIER, 3), unit: DtUnit.GIGA_BYTES},
  { multiplier: Math.pow(KIBI_MULTIPLIER, 2), unit: DtUnit.MEGA_BYTES},
  { multiplier: KIBI_MULTIPLIER, unit: DtUnit.KILO_BYTES},
];
// tslint:enable:no-magic-numbers
/**
 *
 *  Returns DtFormattedValue
 *    - toString() method returns basic string to be displayed;
 *    - displayData contains value, unit and rate unit to be displayed separately;
 *
 * @param input - numeric value to be transformed
 * @param factor - determines whether to use KILO (default) or KIBI multiplier in calculations; does not affect displayed unit
 * @param inputUnit - input unit, typically defined unit of type DtUnit (DtUnit.COUNT by default)
 * @param inputRateUnit - additional information about possible rate unit (optional);
 *    value is used only as a reference in case an additional rate pipe is used
 * @param outputUnit - desired output unit, if undefined a reasonable unit is chosen automatically
 *
 */
export function formatBytes(input: number, factor: number = KILO_MULTIPLIER, inputUnit: DtUnit = DtUnit.BYTES,
                            inputRateUnit?: DtRateUnit | string, outputUnit?: DtUnit): DtFormattedValue {

  const inputData: SourceData = {
    value: input,
    unit: inputUnit,
    rateUnit: inputRateUnit,
    useAbbreviation: false,
  };

  let formattedData: FormattedData = {};
  const value = coerceNumberProperty(inputData.value, NaN);
  if (!isNaN(value)) {
    const valueInBytes = convertToBytes(value, inputData.unit, factor);
    const multiple = outputUnit
      ? getFixedUnitConversion(valueInBytes, outputUnit, factor)
      : getAutoUnitConversion(valueInBytes, factor);

    const convertedValue = multiple ? valueInBytes / multiple.multiplier : valueInBytes;
    const convertedUnit = multiple ? multiple.unit : DtUnit.BYTES;

    formattedData = {
      transformedValue: convertedValue,
      displayValue: adjustNumber(convertedValue),
      displayUnit: convertedUnit,
    };
  }

  return new DtFormattedValue(inputData, formattedData);
}

function getConversions(factor: number): Conversion[] {
  return factor === KIBI_MULTIPLIER
    ? KIBI_CONVERSIONS
    : KILO_CONVERSIONS;
}

function convertToBytes(input: number, inputUnit: string, factor: number): number {
  const multiple = getConversions(factor).find((m) => m.unit === inputUnit);

  return multiple !== undefined
    ? input * multiple.multiplier
    : input;
}

function getAutoUnitConversion(valueInBytes: number, factor: number): Conversion | undefined {
  return getConversions(factor).find((m) => valueInBytes >= m.multiplier);
}

function getFixedUnitConversion(valueInBytes: number, outputUnit: string, factor: number): Conversion | undefined {
  return getConversions(factor).find((m) => m.unit === outputUnit);
}
