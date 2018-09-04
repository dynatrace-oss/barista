import { DtUnit } from '../unit';
import { DtFormattedValue } from '../formatted-value';
import { KIBI_MULTIPLIER, KILO_MULTIPLIER, DtNumberFormatOptions } from '../number-formatter';
import { formatToBitsBytes, DtUnitConversion } from '../bits-bytes-formatter';

/** Default options for the bit formatter */
const DEFAULT_BITS_OPTIONS: DtNumberFormatOptions = {
  factor: KILO_MULTIPLIER,
  inputUnit: DtUnit.BITS,
};

// tslint:disable:no-magic-numbers
const KILO_CONVERSIONS = [
  { multiplier: Math.pow(KILO_MULTIPLIER, 5), unit: DtUnit.PETA_BITS },
  { multiplier: Math.pow(KILO_MULTIPLIER, 4), unit: DtUnit.TERA_BITS },
  { multiplier: Math.pow(KILO_MULTIPLIER, 3), unit: DtUnit.GIGA_BITS },
  { multiplier: Math.pow(KILO_MULTIPLIER, 2), unit: DtUnit.MEGA_BITS },
  { multiplier: KILO_MULTIPLIER, unit: DtUnit.KILO_BITS },
];

const KIBI_CONVERSIONS = [
  { multiplier: Math.pow(KIBI_MULTIPLIER, 5), unit: DtUnit.PETA_BITS },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 4), unit: DtUnit.TERA_BITS },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 3), unit: DtUnit.GIGA_BITS },
  { multiplier: Math.pow(KIBI_MULTIPLIER, 2), unit: DtUnit.MEGA_BITS },
  { multiplier: KIBI_MULTIPLIER, unit: DtUnit.KILO_BITS },
];
// tslint:enable:no-magic-numbers
/**
 * Util function that formats given number as bits
 * @param input - value that gets formatted
 * @param [options] - options that allow more granular formatting
 */
export function formatBits(input: number, options?: DtNumberFormatOptions): DtFormattedValue {

  const mergedOptions: DtNumberFormatOptions = { ...DEFAULT_BITS_OPTIONS, ...options };
  const conversions = getConversions(mergedOptions.factor);
  return formatToBitsBytes(input, conversions, mergedOptions);
}

function getConversions(factor: number): DtUnitConversion[] {
  return factor === KIBI_MULTIPLIER
    ? KIBI_CONVERSIONS
    : KILO_CONVERSIONS;
}
