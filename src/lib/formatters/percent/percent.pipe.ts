import { Pipe, PipeTransform } from '@angular/core';
import { Unit } from '@dynatrace/angular-components/formatters/unit';
import { FormattedValue } from '@dynatrace/angular-components/formatters/formatted-value';
import { _isNumberValue, coerceNumberProperty } from '@angular/cdk/coercion';
import { FormatterUtil } from '@dynatrace/angular-components/formatters/formatter-util';

@Pipe({
  name: 'dtPercent',
})
export class PercentPipe implements PipeTransform {

  constructor(private readonly formatterUtil: FormatterUtil) {
  }

  transform(input: number): FormattedValue {

    const formattedValue = new FormattedValue(input, Unit.PERCENT);
    if (_isNumberValue(input)) {
      const value = (coerceNumberProperty(input));
      formattedValue.displayValue = this.formatterUtil.adjustPrecision(value);
      formattedValue.displayUnit = Unit.PERCENT;
    }

    return formattedValue;
  }

}
