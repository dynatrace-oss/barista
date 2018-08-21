import { Pipe, PipeTransform } from '@angular/core';
import { Unit } from '@dynatrace/angular-components/formatters/unit';
import { FormattedValue } from '@dynatrace/angular-components/formatters/formatted-value';
import { _isNumberValue, coerceNumberProperty } from '@angular/cdk/coercion';
import { FormatterUtil, Multiples } from '@dynatrace/angular-components/formatters/formatter-util';

@Pipe({
  name: 'dtCount',
})
export class CountPipe implements PipeTransform {

  private readonly THOUSAND = 'k';
  private readonly MILLION = 'mil';
  private readonly BILLION = 'bil';
  private readonly multiples: Multiples;

  constructor(private readonly formatterUtil: FormatterUtil) {
    this.multiples = this.formatterUtil.standardMultiples;
  }

  transform(input: number, inputUnit: string = Unit.COUNT, inputRateUnit?: string): FormattedValue {

    const formattedValue = new FormattedValue(input, inputUnit, inputRateUnit);
    if (_isNumberValue(input)) {
      const value = (coerceNumberProperty(input));

      formattedValue.displayValue = value >= this.multiples.lvl1
        ? this.abbreviate(value)
        : this.formatterUtil.adjustPrecision(value);

      formattedValue.displayUnit = inputUnit !== Unit.COUNT
        ? inputUnit
        : undefined;
    }

    return formattedValue;
  }

  private abbreviate(sourceValue: number): string {

    let value = sourceValue;
    let formattedValue: string;

    if (value >= this.multiples.lvl3) {
      value =  value / this.multiples.lvl3;
      formattedValue =  this.formatterUtil.adjustPrecision(value);

      return `${formattedValue}${this.BILLION}`;
    }

    if (value >= this.multiples.lvl2) {
      value =  value / this.multiples.lvl2;
      formattedValue =  this.formatterUtil.adjustPrecision(value);

      return `${formattedValue}${this.MILLION}`;
    }

    value =  value / this.multiples.lvl1;
    formattedValue =  this.formatterUtil.adjustPrecision(value);

    return `${formattedValue}${this.THOUSAND}`;
  }
}
