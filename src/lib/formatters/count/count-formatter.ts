import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DtRateUnit, DtUnit } from '../unit';
import { DtFormattedValue, FormattedData, SourceData } from '../formatted-value';
import { adjustNumber } from '../number-formatter';

export function formatCount(input: number, inputUnit: DtUnit | string = DtUnit.COUNT,
                            inputRateUnit?: DtRateUnit | string): DtFormattedValue {

  const inputData: SourceData = {
    value: input,
    unit: inputUnit,
    rateUnit: inputRateUnit,
    useAbbreviation: true,
  };

  const value = (coerceNumberProperty(input, NaN));
  const formattedData: FormattedData = {};
  if (!isNaN(value)) {
    formattedData.transformedValue = value;
    formattedData.displayValue = adjustNumber(value, inputData.useAbbreviation);
    formattedData.displayUnit = inputUnit !== DtUnit.COUNT
      ? inputUnit
      : undefined;
  }

  return new DtFormattedValue(inputData, formattedData);
}
