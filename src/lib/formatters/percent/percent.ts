import { Pipe, PipeTransform } from '@angular/core';
import { DtUnit } from '../unit';
import { FormattedValue } from '../formatted-value';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { FormatterUtil } from '../formatter-util';

@Pipe({
  name: 'dtPercent',
})
export class DtPercent implements PipeTransform {

  constructor(private readonly _formatterUtil: FormatterUtil) {
  }

  transform(input: number): FormattedValue {

    const formattedValue = new FormattedValue(input, DtUnit.PERCENT);
    const value = (coerceNumberProperty(input, NaN));
    if (!isNaN(value)) {
      formattedValue.displayValue = this._formatterUtil.adjustPrecision(value);
      formattedValue.displayUnit = DtUnit.PERCENT;
    }

    return formattedValue;
  }
}
